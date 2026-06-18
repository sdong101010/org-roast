import { Connection } from "jsforce";
import { toolingQuery } from "@/lib/salesforce";
import { Finding } from "./types";

interface WorkflowRecord {
  TableEnumOrId: string;
  cnt: number;
}

interface FlowRecord {
  MasterLabel: string;
  ProcessType: string;
  Status: string;
}

interface ValidationRuleRecord {
  EntityDefinition: { QualifiedApiName: string };
  ValidationName: string;
  ErrorMessage: string | null;
  Active: boolean;
}

export async function analyzeConfig(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const workflowCounts = await toolingQuery<WorkflowRecord>(
      conn,
      "SELECT TableEnumOrId, COUNT(Id) cnt FROM WorkflowRule GROUP BY TableEnumOrId ORDER BY COUNT(Id) DESC"
    );

    const totalWorkflows = workflowCounts.reduce((sum, r) => sum + r.cnt, 0);
    if (totalWorkflows > 0) {
      findings.push({
        category: "config",
        title: "Workflow Fossil Collection",
        description: `Still rocking ${totalWorkflows} Workflow Rules in ${new Date().getFullYear()}? Salesforce retired those. Time to join the Flow era.`,
        severity: totalWorkflows > 50 ? 5 : totalWorkflows > 20 ? 4 : totalWorkflows > 5 ? 3 : 2,
        details: workflowCounts.map((w) => `${w.TableEnumOrId}: ${w.cnt}`).join(", "),
        remediation: "Use the Migrate to Flow tool in Setup to convert Workflow Rules to Record-Triggered Flows. Prioritize active rules on high-volume objects.",
      });
    }
  } catch (e) {
    console.error("Config workflow analysis failed:", e);
  }

  try {
    const flows = await toolingQuery<FlowRecord>(
      conn,
      "SELECT MasterLabel, ProcessType, Status FROM Flow WHERE Status = 'Active'"
    );

    const processBuilders = flows.filter((f) => f.ProcessType === "Workflow");
    const recordTriggeredFlows = flows.filter((f) => f.ProcessType === "AutoLaunchedFlow" || f.ProcessType === "RecordTriggerFlow");

    if (processBuilders.length > 0 && recordTriggeredFlows.length > 0) {
      findings.push({
        category: "config",
        title: "Automation Identity Crisis",
        description: `${processBuilders.length} Process Builders AND ${recordTriggeredFlows.length} Record-Triggered Flows active at the same time. Pick a lane.`,
        severity: Math.min(5, Math.floor((processBuilders.length + recordTriggeredFlows.length) / 5) + 2),
        details: `${processBuilders.length} Process Builders, ${recordTriggeredFlows.length} Record-Triggered Flows`,
        remediation: "Migrate all Process Builders to Record-Triggered Flows. Consolidate multiple flows per object into a single flow with decision elements.",
      });
    }

    if (flows.length > 100) {
      findings.push({
        category: "config",
        title: "Flow Avalanche",
        description: `${flows.length} active Flows. That's not automation, that's a Rube Goldberg machine.`,
        severity: flows.length > 200 ? 5 : 4,
        details: `${flows.length} active flows total`,
        remediation: "Audit all active flows. Deactivate unused ones, consolidate duplicates, and document the purpose of each remaining flow. Use flow trigger order to manage execution.",
      });
    }
  } catch (e) {
    console.error("Config flow analysis failed:", e);
  }

  try {
    const rules = await toolingQuery<ValidationRuleRecord>(
      conn,
      "SELECT EntityDefinition.QualifiedApiName, ValidationName, ErrorMessage, Active FROM ValidationRule WHERE Active = true LIMIT 200"
    );

    const noMessage = rules.filter((r) => !r.ErrorMessage || r.ErrorMessage.trim() === "");
    if (noMessage.length > 0) {
      findings.push({
        category: "config",
        title: "Silent Validators",
        description: `${noMessage.length} active validation rule(s) with no error message. Users hit a wall and have no idea why.`,
        severity: noMessage.length > 10 ? 4 : noMessage.length > 3 ? 3 : 2,
        details: noMessage.slice(0, 5).map((r) => `${r.EntityDefinition.QualifiedApiName}.${r.ValidationName}`).join(", "),
        remediation: "Add clear, user-friendly error messages to every validation rule. Explain what went wrong and how to fix it — not just 'Error.'",
      });
    }
  } catch (e) {
    console.error("Validation rule analysis failed:", e);
  }

  return findings;
}
