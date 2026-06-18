import { NextRequest, NextResponse } from "next/server";
import { getOAuth2 } from "@/lib/salesforce";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isSandbox = searchParams.get("sandbox") === "true";

  const oauth2 = getOAuth2(isSandbox);

  const authUrl = oauth2.getAuthorizationUrl({
    scope: "full refresh_token",
    state: isSandbox ? "sandbox" : "production",
  });

  return NextResponse.redirect(authUrl);
}
