import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { generateFixPlanStream } from "@/lib/fix-plan-generator";
import { Finding } from "@/lib/analyzers";
import { isDemoOrg } from "@/lib/demo-data";

const DEMO_FIX_PLAN = `[QUICK WIN] Write Apex Tests — Open Developer Console, run uncovered classes through Setup > Apex Test Execution. Target 85%+ starting with trigger handlers.

[MEDIUM] Bulkify SOQL in Loops — Refactor the 12 flagged classes to collect IDs into Sets, query once outside the loop, and use Maps for lookups.

[MEDIUM] Consolidate Admins — Create a custom "Power User" profile cloning System Admin with reduced permissions. Reassign 18 of 21 admins to it via Setup > Users.

[LARGE] Migrate to Flows — Use Setup > Migrate to Flow to convert Process Builders. Consolidate per-object into single Record-Triggered Flows with Before/After contexts.

[QUICK WIN] Enable Agentforce — Spin up a Service Agent from Setup > Agentforce. Start with the standard case-routing topic and FAQ action — takes under an hour.`;

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const findings: Finding[] = body.findings;

  if (!findings || !Array.isArray(findings)) {
    return Response.json({ error: "Invalid findings data" }, { status: 400 });
  }

  const isDemo = session.instanceUrl && isDemoOrg(session.instanceUrl);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (isDemo) {
          const words = DEMO_FIX_PLAN.split(/(\s+)/);
          for (const word of words) {
            controller.enqueue(encoder.encode(word));
            await new Promise((r) => setTimeout(r, 20));
          }
        } else {
          for await (const chunk of generateFixPlanStream(findings)) {
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
      } catch (err) {
        console.error("Fix plan stream failed:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
