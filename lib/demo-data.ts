import { Finding } from "./analyzers/types";

export const DEMO_INSTANCE_URL = "https://seadong-250328-65-demo.my.salesforce.com";

export function isDemoOrg(instanceUrl: string): boolean {
  return instanceUrl.includes("seadong-250328-65-demo");
}

export const DEMO_FINDINGS: Finding[] = [
  {
    category: "code",
    title: "Test Coverage Drought",
    description:
      "Org-wide Apex test coverage is 0%. Salesforce requires 75% to deploy. You're living on borrowed time.",
    severity: 5,
    details: "0% coverage (0/0 lines)",
    remediation: "Write unit tests for uncovered classes starting with the most critical business logic. Aim for 85%+ coverage with meaningful assertions, not just line coverage.",
  },
  {
    category: "code",
    title: "SOQL in a Loop",
    description:
      "Found 12 class(es) with SOQL queries inside loops. Governor limits are crying right now.",
    severity: 5,
    details:
      "SBX_Demo, SDO_SFS, and 10 more classes",
    remediation: "Move SOQL queries outside loops. Collect IDs into a Set, query once, then iterate over results. Use Maps for lookups instead of repeated queries.",
  },
  {
    category: "security",
    title: "Admin Party",
    description:
      "21 active users with System Administrator profile. That's not a team, that's a liability.",
    severity: 5,
    details: "21 active system administrators",
    remediation: "Create custom profiles with minimum necessary permissions. Reserve System Administrator for actual admins (2-3 max). Use permission sets for temporary elevated access.",
  },
  {
    category: "config",
    title: "Automation Identity Crisis",
    description:
      "14 Process Builders AND 166 Record-Triggered Flows active at the same time. Pick a lane.",
    severity: 5,
    details: "14 Process Builders, 166 Record-Triggered Flows",
    remediation: "Migrate all Process Builders to Record-Triggered Flows. Consolidate multiple flows per object into a single flow with decision elements.",
  },
  {
    category: "config",
    title: "Flow Avalanche",
    description:
      "361 active Flows. That's not automation, that's a Rube Goldberg machine.",
    severity: 5,
    details: "361 active flows total",
    remediation: "Audit all active flows. Deactivate unused ones, consolidate duplicates, and document the purpose of each remaining flow. Use flow trigger order to manage execution.",
  },
  {
    category: "agentforce",
    title: "AI Skeptic",
    description:
      "It's 2026 and your org has zero agents. Your reps are still copy-pasting from sticky notes while AI does the work everywhere else.",
    severity: 3,
    details: "0 BotDefinition records found",
    remediation: "Start with an out-of-the-box Agentforce Service Agent or Sales Coach. You can have a working agent in under an hour using standard actions and topics.",
  },
  {
    category: "datacloud",
    title: "Data Silo Enthusiast",
    description:
      "No Data Cloud? Your customer data is scattered across 14 systems and a spreadsheet named 'FINAL_v3_USE_THIS.xlsx'.",
    severity: 2,
    details: "Data Cloud not provisioned (SSOT endpoint unavailable)",
    remediation: "Consider enabling Data Cloud to unify customer data across systems. Start with CRM connector streams and identity resolution to build unified profiles.",
  },
];

/** Verbatim-ish transcript of `public/demo-roast.mp3` (must match spoken demo track). */
export const DEMO_ROAST = `Yo, I'm here to spit facts.
This org is a fright, 0% Apex.
Your code's got no light.
No test class in sight, your deploys are a bluff,
One false move, and your whole system is rough.

SOQL in 12 loops, you're hitting the limit hard.
Governor screaming, tearing up your credit card.
21 sys-admins, that's no team.
It's a raid, a security nightmare,
Just waiting to degrade.

Process Builders with Flows, what's your automation plan?
Identity crisis, confused across your org's terrain.
361 Flows, that's a Rube Goldberg sprawl.
Your org's a ticking time bomb, about to flatline and fall.

This ain't Salesforce, son, this is a code disaster.
Your next release is a funeral, moving faster!`;
