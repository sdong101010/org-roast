import { Connection } from "jsforce";
import { toolingQuery } from "@/lib/salesforce";
import { Finding } from "./types";

interface BotDefinitionRecord {
  Id: string;
  DeveloperName: string;
  MasterLabel: string;
}

interface BotVersionRecord {
  Id: string;
  DeveloperName: string;
  Status: string;
  BotDefinitionId: string;
}

export async function analyzeAgentforce(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const bots = await toolingQuery<BotDefinitionRecord>(
      conn,
      "SELECT Id, DeveloperName, MasterLabel FROM BotDefinition"
    );

    if (bots.length === 0) {
      findings.push({
        category: "agentforce",
        title: "AI Skeptic",
        description:
          "It's 2026 and your org has zero agents. Your reps are still copy-pasting from sticky notes while AI does the work everywhere else.",
        severity: 3,
        details: "0 BotDefinition records found",
        remediation:
          "Start with an out-of-the-box Agentforce Service Agent or Sales Coach. You can have a working agent in under an hour using standard actions and topics.",
      });
      return findings;
    }

    const versions = await toolingQuery<BotVersionRecord>(
      conn,
      "SELECT Id, DeveloperName, Status, BotDefinitionId FROM BotVersion"
    );

    const activeVersions = versions.filter((v) => v.Status === "Active");

    if (activeVersions.length === 0) {
      findings.push({
        category: "agentforce",
        title: "Agent Graveyard",
        description: `${bots.length} agent(s) built but not a single one is active. That's like buying a gym membership and never going.`,
        severity: 3,
        details: `${bots.length} bot definitions, 0 active versions`,
        remediation:
          "Review your inactive agents and activate at least one. If they were deactivated due to issues, check the agent logs and fix topic classification or action mappings.",
      });
    }

    const activeBotIds = new Set(activeVersions.map((v) => v.BotDefinitionId));
    const inactiveBots = bots.filter((b) => !activeBotIds.has(b.Id));

    if (inactiveBots.length > 0 && activeVersions.length > 0) {
      const ratio = inactiveBots.length / bots.length;
      if (ratio >= 0.5) {
        findings.push({
          category: "agentforce",
          title: "Agent Abandonment Issues",
          description: `${inactiveBots.length} out of ${bots.length} agents are inactive. You start agents but don't finish them — commitment issues much?`,
          severity: 2,
          details: `Inactive: ${inactiveBots.map((b) => b.MasterLabel).join(", ")}`,
          remediation:
            "Audit inactive agents. Either activate them with proper topics and actions, or delete the ones that were just experiments.",
        });
      }
    }
  } catch (e) {
    console.error("Agentforce analysis failed:", e);
  }

  return findings;
}
