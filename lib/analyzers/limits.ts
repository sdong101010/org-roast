import { Connection } from "jsforce";
import { fetchLimits } from "@/lib/salesforce";
import { Finding } from "./types";

const FRIENDLY_NAMES: Record<string, string> = {
  DataStorageMB: "Data Storage",
  FileStorageMB: "File Storage",
  DailyApiRequests: "Daily API Requests",
  DailyBulkApiRequests: "Daily Bulk API Requests",
  DailyAsyncApexExecutions: "Daily Async Apex Executions",
  StreamingApiConcurrentClients: "Streaming API Concurrent Clients",
  DailyWorkflowEmails: "Daily Workflow Emails",
  HourlyTimeBasedWorkflow: "Hourly Time-Based Workflow",
  SingleEmail: "Single Email Invocations",
  MassEmail: "Mass Email Invocations",
};

export async function analyzeLimits(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const limits = await fetchLimits(conn);

    const criticalLimits: { name: string; used: number; max: number; pct: number }[] = [];

    for (const [key, value] of Object.entries(limits)) {
      if (!value || typeof value.Max !== "number" || typeof value.Remaining !== "number") continue;
      if (value.Max === 0) continue;

      const used = value.Max - value.Remaining;
      const pct = Math.round((used / value.Max) * 100);

      if (pct >= 80) {
        criticalLimits.push({
          name: FRIENDLY_NAMES[key] || key,
          used,
          max: value.Max,
          pct,
        });
      }
    }

    criticalLimits.sort((a, b) => b.pct - a.pct);

    if (criticalLimits.length > 0) {
      const worst = criticalLimits[0];
      findings.push({
        category: "limits",
        title: "Hitting the Ceiling",
        description: `${worst.name} is at ${worst.pct}% capacity (${worst.used.toLocaleString()} / ${worst.max.toLocaleString()}).${criticalLimits.length > 1 ? ` And ${criticalLimits.length - 1} more limits are sweating too.` : ""} This org is one bad day away from a meltdown.`,
        severity: worst.pct >= 95 ? 5 : worst.pct >= 90 ? 4 : 3,
        details: criticalLimits.map((l) => `${l.name}: ${l.pct}%`).join(", "),
        remediation: "Review batch jobs and integrations consuming API calls. Optimize bulkified processes, reduce unnecessary automation triggers, and schedule heavy operations off-peak.",
      });
    }

    const storageLimit = limits["DataStorageMB"];
    if (storageLimit) {
      const usedMB = storageLimit.Max - storageLimit.Remaining;
      const pct = Math.round((usedMB / storageLimit.Max) * 100);
      if (pct >= 70 && !criticalLimits.find((l) => l.name === "Data Storage")) {
        findings.push({
          category: "limits",
          title: "Data Hoarding",
          description: `Using ${usedMB.toLocaleString()}MB of ${storageLimit.Max.toLocaleString()}MB data storage (${pct}%). Marie Kondo would not approve.`,
          severity: pct >= 90 ? 5 : pct >= 80 ? 4 : 3,
          details: `${usedMB}MB / ${storageLimit.Max}MB (${pct}%)`,
          remediation: "Archive old records with Big Objects or external storage. Delete orphaned records, purge old logs, and implement data retention policies.",
        });
      }
    }
  } catch (e) {
    console.error("Limits analysis failed:", e);
  }

  return findings;
}
