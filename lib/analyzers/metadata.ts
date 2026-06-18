import { Connection } from "jsforce";
import { restQuery } from "@/lib/salesforce";
import { Finding } from "./types";

interface FieldCountRecord {
  EntityDefinitionId: string;
  cnt: number;
}

interface EntityRecord {
  QualifiedApiName: string;
  Label: string;
}

interface StaleFieldRecord {
  QualifiedApiName: string;
  EntityDefinition: { QualifiedApiName: string };
  LastModifiedDate: string;
}

export async function analyzeMetadata(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const fieldCounts = await restQuery<FieldCountRecord>(
      conn,
      "SELECT EntityDefinitionId, COUNT(Id) cnt FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName LIKE '%__c' GROUP BY EntityDefinitionId ORDER BY COUNT(Id) DESC LIMIT 10"
    );

    const bloatedObjects = fieldCounts.filter((r) => r.cnt >= 100);
    if (bloatedObjects.length > 0) {
      const worst = bloatedObjects[0];
      findings.push({
        category: "metadata",
        title: "Field Explosion",
        description: `Object "${worst.EntityDefinitionId}" has ${worst.cnt} custom fields. ${bloatedObjects.length > 1 ? `And ${bloatedObjects.length - 1} more objects are just as bloated.` : ""}`,
        severity: Math.min(5, Math.floor(worst.cnt / 50)),
        details: bloatedObjects.map((o) => `${o.EntityDefinitionId}: ${o.cnt} fields`).join(", "),
        remediation: "Audit custom fields for usage. Remove or archive fields with no data. Consider splitting bloated objects into related child objects.",
      });
    }
  } catch (e) {
    console.error("Metadata field count analysis failed:", e);
  }

  try {
    const customObjects = await restQuery<EntityRecord>(
      conn,
      "SELECT QualifiedApiName, Label FROM EntityDefinition WHERE IsCustomizable = true AND QualifiedApiName LIKE '%__c' LIMIT 300"
    );

    if (customObjects.length >= 200) {
      findings.push({
        category: "metadata",
        title: "Object Hoarder",
        description: `This org has ${customObjects.length}+ custom objects. That's not a data model, that's a landfill.`,
        severity: Math.min(5, Math.floor(customObjects.length / 100)),
        details: `${customObjects.length} custom objects found`,
        remediation: "Inventory all custom objects and identify which are actively used. Archive or delete objects with zero records. Consolidate overlapping objects.",
      });
    }
  } catch (e) {
    console.error("Metadata object count analysis failed:", e);
  }

  try {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const cutoff = twoYearsAgo.toISOString().split("T")[0] + "T00:00:00Z";

    const staleFields = await restQuery<StaleFieldRecord>(
      conn,
      `SELECT QualifiedApiName, EntityDefinition.QualifiedApiName, LastModifiedDate FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName LIKE '%__c' AND QualifiedApiName LIKE '%__c' AND LastModifiedDate < ${cutoff} LIMIT 200`
    );

    if (staleFields.length >= 50) {
      findings.push({
        category: "metadata",
        title: "Field Graveyard",
        description: `${staleFields.length}+ custom fields haven't been touched in over 2 years. They're just collecting dust in your org.`,
        severity: staleFields.length >= 150 ? 4 : staleFields.length >= 100 ? 3 : 2,
        details: `${staleFields.length} fields untouched since ${twoYearsAgo.getFullYear()}`,
        remediation: "Run a field utilization report. Fields with zero population can likely be deleted. Archive field data before removal and communicate changes to stakeholders.",
      });
    }
  } catch (e) {
    console.error("Stale field analysis failed:", e);
  }

  return findings;
}
