import { Connection } from "jsforce";
import { restQuery } from "@/lib/salesforce";
import { Finding } from "./types";

interface ProfileRecord {
  Name: string;
  PermissionsModifyAllData: boolean;
  PermissionsViewAllData: boolean;
}

interface UserCountRecord {
  ProfileId: string;
  Profile: { Name: string };
  cnt: number;
}

export async function analyzeSecurity(conn: Connection): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const godProfiles = await restQuery<ProfileRecord>(
      conn,
      "SELECT Name, PermissionsModifyAllData, PermissionsViewAllData FROM Profile WHERE PermissionsModifyAllData = true"
    );

    if (godProfiles.length > 2) {
      findings.push({
        category: "security",
        title: "Everyone's an Admin",
        description: `${godProfiles.length} profiles have "Modify All Data" enabled. That's not security, that's an open-door policy.`,
        severity: Math.min(5, godProfiles.length - 1),
        details: godProfiles.map((p) => p.Name).join(", "),
        remediation: "Remove Modify All Data from non-admin profiles. Use permission sets for elevated access and grant object/field-level permissions instead of org-wide powers.",
      });
    }
  } catch (e) {
    console.error("Security profile analysis failed:", e);
  }

  try {
    const adminUsers = await restQuery<UserCountRecord>(
      conn,
      "SELECT ProfileId, Profile.Name, COUNT(Id) cnt FROM User WHERE Profile.Name = 'System Administrator' AND IsActive = true GROUP BY ProfileId, Profile.Name"
    );

    const adminCount = adminUsers.length > 0 ? adminUsers[0].cnt : 0;
    if (adminCount > 5) {
      findings.push({
        category: "security",
        title: "Admin Party",
        description: `${adminCount} active users with System Administrator profile. That's not a team, that's a liability.`,
        severity: adminCount > 20 ? 5 : adminCount > 10 ? 4 : 3,
        details: `${adminCount} active system administrators`,
        remediation: "Create custom profiles with minimum necessary permissions. Reserve System Administrator for actual admins (2-3 max). Use permission sets for temporary elevated access.",
      });
    }
  } catch (e) {
    console.error("Security admin count analysis failed:", e);
  }

  try {
    const viewAllProfiles = await restQuery<ProfileRecord>(
      conn,
      "SELECT Name, PermissionsViewAllData FROM Profile WHERE PermissionsViewAllData = true"
    );

    if (viewAllProfiles.length > 3) {
      findings.push({
        category: "security",
        title: "Data Peep Show",
        description: `${viewAllProfiles.length} profiles have "View All Data." Your data has zero privacy. It's basically posting on social media.`,
        severity: Math.min(4, viewAllProfiles.length - 2),
        details: viewAllProfiles.map((p) => p.Name).join(", "),
        remediation: "Replace View All Data with sharing rules and role hierarchy to grant targeted visibility. Only integration users and true admins should have this permission.",
      });
    }
  } catch (e) {
    console.error("Security view-all analysis failed:", e);
  }

  return findings;
}
