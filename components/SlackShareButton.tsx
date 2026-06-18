"use client";

import { useState, useCallback } from "react";
import { Finding } from "@/lib/analyzers/types";
import { OrgGrade } from "@/lib/score";

export default function SlackShareButton({
  grade,
  findings,
}: {
  grade: OrgGrade;
  findings: Finding[];
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "unavailable">("idle");

  const handleShare = useCallback(async () => {
    setState("sending");
    try {
      const res = await fetch("/api/share-slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: grade.score,
          letter: grade.letter,
          label: grade.label,
          findings: findings.map((f) => ({
            category: f.category,
            title: f.title,
            severity: f.severity,
          })),
        }),
      });

      if (res.status === 501) {
        setState("unavailable");
        return;
      }

      if (!res.ok) throw new Error();
      setState("sent");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }, [grade, findings]);

  if (state === "unavailable") return null;

  const config = {
    idle: { label: "Post to Slack", icon: "💬", disabled: false },
    sending: { label: "Posting...", icon: "⏳", disabled: true },
    sent: { label: "Posted!", icon: "✅", disabled: true },
    error: { label: "Failed", icon: "✕", disabled: false },
  }[state];

  return (
    <button
      onClick={handleShare}
      disabled={config.disabled}
      className={`flex items-center gap-2 px-6 py-3 rounded-full
                  font-display font-bold text-sm tracking-wide uppercase
                  transition-all cursor-pointer disabled:cursor-wait
                  ${state === "sent"
                    ? "border border-neon-green/30 text-neon-green"
                    : state === "error"
                      ? "border border-pink/30 text-pink"
                      : "border border-white/[0.06] text-text-dim hover:border-cyan/30 hover:text-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.1)] hover:scale-105"
                  }`}
    >
      <span>{config.icon}</span>
      {config.label}
    </button>
  );
}
