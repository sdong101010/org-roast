import { NextRequest, NextResponse } from "next/server";
import { Connection } from "jsforce";
import { getOAuth2 } from "@/lib/salesforce";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(
      new URL("/?error=no_code", process.env.NEXT_PUBLIC_BASE_URL!)
    );
  }

  const isSandbox = state === "sandbox";
  const oauth2 = getOAuth2(isSandbox);

  const conn = new Connection({ oauth2 });

  try {
    await conn.authorize(code);

    const session = await getSession();
    session.accessToken = conn.accessToken!;
    session.instanceUrl = conn.instanceUrl;
    session.refreshToken = conn.refreshToken!;
    await session.save();

    return NextResponse.redirect(
      new URL("/roast", process.env.NEXT_PUBLIC_BASE_URL!)
    );
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/?error=auth_failed", process.env.NEXT_PUBLIC_BASE_URL!)
    );
  }
}
