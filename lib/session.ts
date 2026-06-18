import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  accessToken?: string;
  instanceUrl?: string;
  refreshToken?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_xxx",
  cookieName: "org-roast-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
