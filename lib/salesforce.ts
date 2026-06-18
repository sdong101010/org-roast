import { Connection, OAuth2 } from "jsforce";

export function getConnection(accessToken: string, instanceUrl: string): Connection {
  return new Connection({
    instanceUrl,
    accessToken,
    version: "62.0",
  });
}

export function getOAuth2(isSandbox: boolean): OAuth2 {
  const loginUrl = isSandbox
    ? "https://test.salesforce.com"
    : "https://login.salesforce.com";

  return new OAuth2({
    loginUrl,
    clientId: process.env.SALESFORCE_CLIENT_ID!,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function toolingQuery<T = any>(
  conn: Connection,
  soql: string
): Promise<T[]> {
  const result = await conn.tooling.query(soql);
  return result.records as T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function restQuery<T = any>(
  conn: Connection,
  soql: string
): Promise<T[]> {
  const result = await conn.query(soql);
  return result.records as T[];
}

export async function fetchLimits(
  conn: Connection
): Promise<Record<string, { Max: number; Remaining: number }>> {
  const response = await conn.request("/services/data/v62.0/limits");
  return response as Record<string, { Max: number; Remaining: number }>;
}
