import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { generateRoastStream } from "@/lib/roast-generator";
import { Finding } from "@/lib/analyzers";
import { isDemoOrg, DEMO_ROAST } from "@/lib/demo-data";

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
          const words = DEMO_ROAST.split(/(\s+)/);
          for (const word of words) {
            controller.enqueue(encoder.encode(word));
            await new Promise((r) => setTimeout(r, 30));
          }
        } else {
          for await (const chunk of generateRoastStream(findings)) {
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
      } catch (err) {
        console.error("Roast stream failed:", err);
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
