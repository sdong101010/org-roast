/**
 * Wraps every server endpoint the client calls. In static-export demo builds
 * (NEXT_PUBLIC_DEMO_MODE === "1") all calls short-circuit to local demo data
 * + the prerecorded audio file in /public. In normal builds it's just fetch.
 */

import type { Finding } from "./analyzers/types";
import type { OrgGrade } from "./score";
import {
  DEMO_FINDINGS,
  DEMO_FIX_PLAN,
  DEMO_ROAST,
} from "./demo-data";
import { calculateScore } from "./score";

export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "1";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public asset path with the deployed basePath. */
export function assetUrl(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

async function streamWords(text: string): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);
  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        await new Promise((r) => setTimeout(r, 20));
      }
      controller.close();
    },
  });
}

export async function analyzeOrg(): Promise<{
  findings: Finding[];
  grade: OrgGrade;
  isDemo: boolean;
}> {
  if (IS_DEMO) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      findings: DEMO_FINDINGS,
      grade: calculateScore(DEMO_FINDINGS),
      isDemo: true,
    };
  }
  const res = await fetch("/api/analyze");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Analysis failed");
  }
  return res.json();
}

export async function fetchRoastStream(
  findings: Finding[],
): Promise<ReadableStream<Uint8Array>> {
  if (IS_DEMO) {
    return streamWords(DEMO_ROAST);
  }
  const res = await fetch("/api/roast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findings }),
  });
  if (!res.ok || !res.body) throw new Error("Roast generation failed");
  return res.body;
}

export async function fetchFixPlanStream(
  findings: Finding[],
): Promise<ReadableStream<Uint8Array>> {
  if (IS_DEMO) {
    return streamWords(DEMO_FIX_PLAN);
  }
  const res = await fetch("/api/fix-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findings }),
  });
  if (!res.ok || !res.body) throw new Error("Fix plan generation failed");
  return res.body;
}

export async function fetchRoastAudio(_text: string): Promise<Blob> {
  if (IS_DEMO) {
    const res = await fetch(assetUrl("/demo-roast.mp3"));
    if (!res.ok) throw new Error("Demo audio missing");
    return res.blob();
  }
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: _text }),
  });
  if (!res.ok) throw new Error("Audio generation failed");
  return res.blob();
}

export type SlackShareResult = "sent" | "unavailable" | "error";

export async function postToSlack(payload: {
  score: number;
  letter: string;
  label: string;
  findings: Array<{ category: string; title: string; severity: number }>;
}): Promise<SlackShareResult> {
  if (IS_DEMO) return "unavailable";
  try {
    const res = await fetch("/api/share-slack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 501) return "unavailable";
    if (!res.ok) return "error";
    return "sent";
  } catch {
    return "error";
  }
}
