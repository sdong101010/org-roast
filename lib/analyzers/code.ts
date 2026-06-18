import { Connection } from "jsforce";
import { toolingQuery } from "@/lib/salesforce";
import { Finding } from "./types";

interface CoverageRecord {
  ApexClassOrTriggerId: string;
  ApexClassOrTrigger: { Name: string };
  NumLinesCovered: number;
  NumLinesUncovered: number;
}

interface TriggerRecord {
  Name: string;
  Body: string;
  TableEnumOrId: string;
}

interface ApexClassRecord {
  Name: string;
  Body: string;
  LengthWithoutComments: number;
}

export async function analyzeCode(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const coverage = await toolingQuery<CoverageRecord>(
      conn,
      "SELECT ApexClassOrTriggerId, ApexClassOrTrigger.Name, NumLinesCovered, NumLinesUncovered FROM ApexCodeCoverageAggregate"
    );

    if (coverage.length > 0) {
      const totalCovered = coverage.reduce((sum, r) => sum + r.NumLinesCovered, 0);
      const totalUncovered = coverage.reduce((sum, r) => sum + r.NumLinesUncovered, 0);
      const totalLines = totalCovered + totalUncovered;
      const coveragePercent = totalLines > 0 ? Math.round((totalCovered / totalLines) * 100) : 0;

      if (coveragePercent < 75) {
        findings.push({
          category: "code",
          title: "Test Coverage Drought",
          description: `Org-wide Apex test coverage is ${coveragePercent}%. Salesforce requires 75% to deploy. You're living on borrowed time.`,
          severity: coveragePercent < 50 ? 5 : coveragePercent < 65 ? 4 : 3,
          details: `${coveragePercent}% coverage (${totalCovered}/${totalLines} lines)`,
          remediation: "Write unit tests for uncovered classes starting with the most critical business logic. Aim for 85%+ coverage with meaningful assertions, not just line coverage.",
        });
      }
    }
  } catch (e) {
    console.error("Code coverage analysis failed:", e);
  }

  try {
    const triggers = await toolingQuery<TriggerRecord>(
      conn,
      "SELECT Name, Body, TableEnumOrId FROM ApexTrigger WHERE Status = 'Active' LIMIT 50"
    );

    const fatTriggers = triggers.filter((t) => {
      if (!t.Body) return false;
      const lines = t.Body.split("\n").length;
      return lines > 30;
    });

    if (fatTriggers.length > 0) {
      findings.push({
        category: "code",
        title: "Trigger Happy",
        description: `Found ${fatTriggers.length} trigger(s) with business logic jammed right in. Ever heard of a handler class?`,
        severity: Math.min(5, fatTriggers.length),
        details: fatTriggers.map((t) => t.Name).join(", "),
        remediation: "Refactor triggers to use a handler pattern: trigger calls a handler class, handler contains all logic. One trigger per object, dispatching to handler methods.",
      });
    }
  } catch (e) {
    console.error("Trigger analysis failed:", e);
  }

  try {
    const classes = await toolingQuery<ApexClassRecord>(
      conn,
      "SELECT Name, Body, LengthWithoutComments FROM ApexClass WHERE NamespacePrefix = null AND Status = 'Active' LIMIT 100"
    );

    const soqlInLoopPattern = /for\s*\([\s\S]*?\)\s*\{[\s\S]*?\[SELECT/gi;
    const offenders = classes.filter((c) => c.Body && soqlInLoopPattern.test(c.Body));

    if (offenders.length > 0) {
      findings.push({
        category: "code",
        title: "SOQL in a Loop",
        description: `Found ${offenders.length} class(es) with SOQL queries inside loops. Governor limits are crying right now.`,
        severity: Math.min(5, offenders.length + 1),
        details: offenders.map((c) => c.Name).join(", "),
        remediation: "Move SOQL queries outside loops. Collect IDs into a Set, query once, then iterate over results. Use Maps for lookups instead of repeated queries.",
      });
    }
  } catch (e) {
    console.error("SOQL-in-loop analysis failed:", e);
  }

  try {
    const classes = await toolingQuery<ApexClassRecord>(
      conn,
      "SELECT Name, Body, LengthWithoutComments FROM ApexClass WHERE NamespacePrefix = null AND Status = 'Active' LIMIT 200"
    );

    const hardcodedIdPattern = /['"][a-zA-Z0-9]{15}['"]|['"][a-zA-Z0-9]{18}['"]/g;
    const knownPrefixes = ["001", "003", "005", "006", "00D", "00G", "00e", "012", "01I", "0SO"];
    const offenders: string[] = [];

    for (const cls of classes) {
      if (!cls.Body) continue;
      const matches = cls.Body.match(hardcodedIdPattern);
      if (matches) {
        const hasRealId = matches.some((m) => {
          const id = m.slice(1, -1);
          return knownPrefixes.some((p) => id.startsWith(p));
        });
        if (hasRealId) offenders.push(cls.Name);
      }
    }

    if (offenders.length > 0) {
      findings.push({
        category: "code",
        title: "Hardcoded IDs",
        description: `Found ${offenders.length} class(es) with hardcoded Salesforce record IDs. One sandbox refresh and these all break.`,
        severity: Math.min(5, offenders.length + 1),
        details: offenders.slice(0, 5).join(", ") + (offenders.length > 5 ? `, and ${offenders.length - 5} more` : ""),
        remediation: "Replace hardcoded IDs with Custom Metadata Types, Custom Settings, or Custom Labels. Use queries to resolve IDs dynamically at runtime.",
      });
    }
  } catch (e) {
    console.error("Hardcoded ID analysis failed:", e);
  }

  return findings;
}
