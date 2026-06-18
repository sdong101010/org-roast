import { Connection } from "jsforce";
import { Finding } from "./types";

interface DataStreamRecord {
  name: string;
  category?: string;
  totalRecordsPublished?: number;
  lastRefreshDate?: string;
}

export async function analyzeDataCloud(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const response = (await conn.request(
      "/services/data/v62.0/ssot/data-streams"
    )) as { data?: DataStreamRecord[] };

    const streams = response?.data ?? [];

    if (streams.length === 0) {
      findings.push({
        category: "datacloud",
        title: "Empty Cloud",
        description:
          "You paid for Data Cloud and nobody's home. Zero data streams. The unified profile is just... empty.",
        severity: 3,
        details: "Data Cloud provisioned but 0 data streams configured",
        remediation:
          "Start by connecting your CRM data with a Salesforce CRM connector stream. Then add web or mobile engagement data to build a true 360 profile.",
      });
      return findings;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleStreams = streams.filter((s) => {
      if (!s.lastRefreshDate) return true;
      return new Date(s.lastRefreshDate) < thirtyDaysAgo;
    });

    if (staleStreams.length > 0 && staleStreams.length === streams.length) {
      findings.push({
        category: "datacloud",
        title: "Stale Data Lake",
        description: `All ${streams.length} data stream(s) haven't refreshed in over 30 days. Your Data Cloud is a Data Fossil.`,
        severity: 3,
        details: `${staleStreams.length}/${streams.length} streams stale (>30 days)`,
        remediation:
          "Check your data stream schedules and connector health. Stale data means your segments and activations are working with outdated profiles.",
      });
    } else if (staleStreams.length > 0) {
      findings.push({
        category: "datacloud",
        title: "Data Drip",
        description: `${staleStreams.length} of ${streams.length} data streams are stale. Your unified profile has some serious blind spots.`,
        severity: 2,
        details: `${staleStreams.length} stale streams out of ${streams.length} total`,
        remediation:
          "Review stale data streams in Data Cloud Setup. Fix broken connectors and ensure refresh schedules are active.",
      });
    }
  } catch {
    // SSOT endpoint not available — Data Cloud not provisioned
    findings.push({
      category: "datacloud",
      title: "Data Silo Enthusiast",
      description:
        "No Data Cloud? Your customer data is scattered across 14 systems and a spreadsheet named 'FINAL_v3_USE_THIS.xlsx'.",
      severity: 2,
      details: "Data Cloud not provisioned (SSOT endpoint unavailable)",
      remediation:
        "Consider enabling Data Cloud to unify customer data across systems. Start with CRM connector streams and identity resolution to build unified profiles.",
    });
  }

  return findings;
}
