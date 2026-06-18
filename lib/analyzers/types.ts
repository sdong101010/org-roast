export interface Finding {
  category: "metadata" | "code" | "security" | "config" | "limits" | "datacloud" | "agentforce";
  title: string;
  description: string;
  severity: number; // 1-5
  details: string;
  remediation: string;
}
