import { Connection } from "jsforce";
import { Finding } from "./types";
import { analyzeMetadata } from "./metadata";
import { analyzeCode } from "./code";
import { analyzeSecurity } from "./security";
import { analyzeConfig } from "./config";
import { analyzeLimits } from "./limits";
import { analyzeAgentforce } from "./agentforce";
import { analyzeDataCloud } from "./datacloud";

export type { Finding };

export type AnalyzerName = "metadata" | "code" | "security" | "config" | "limits" | "agentforce" | "datacloud";

export interface AnalysisProgress {
  analyzer: AnalyzerName;
  status: "running" | "done" | "error";
}

export async function runAllAnalyzers(conn: Connection): Promise<Finding[]> {
  const results = await Promise.allSettled([
    analyzeMetadata(conn),
    analyzeCode(conn),
    analyzeSecurity(conn),
    analyzeConfig(conn),
    analyzeLimits(conn),
    analyzeAgentforce(conn),
    analyzeDataCloud(conn),
  ]);

  const allFindings: Finding[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allFindings.push(...result.value);
    }
  }

  allFindings.sort((a, b) => b.severity - a.severity);

  return allFindings.slice(0, 7);
}
