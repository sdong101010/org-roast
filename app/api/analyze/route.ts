import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getConnection } from "@/lib/salesforce";
import { runAllAnalyzers } from "@/lib/analyzers";
import { isDemoOrg, DEMO_FINDINGS } from "@/lib/demo-data";
import { calculateScore } from "@/lib/score";

export async function GET() {
  const session = await getSession();

  if (!session.accessToken || !session.instanceUrl) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (isDemoOrg(session.instanceUrl)) {
    const grade = calculateScore(DEMO_FINDINGS);
    return NextResponse.json({ findings: DEMO_FINDINGS, grade, isDemo: true });
  }

  try {
    const conn = getConnection(session.accessToken, session.instanceUrl);
    const findings = await runAllAnalyzers(conn);
    const grade = calculateScore(findings);

    return NextResponse.json({ findings, grade, isDemo: false });
  } catch (err) {
    console.error("Analysis failed:", err);
    return NextResponse.json(
      { error: "Analysis failed. Your session may have expired." },
      { status: 500 }
    );
  }
}
