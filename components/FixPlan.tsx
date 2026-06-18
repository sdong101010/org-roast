"use client";

import { useState, useCallback } from "react";
import { Finding } from "@/lib/analyzers/types";
import { fetchFixPlanStream } from "@/lib/api-client";

const EFFORT_COLORS: Record<string, string> = {
  "QUICK WIN": "#39ff14",
  MEDIUM: "#ffd700",
  LARGE: "#ff3366",
};

function parsePlanLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("["))
    .map((line) => {
      const match = line.match(/^\[([^\]]+)]\s*(.+?)\s*—\s*(.+)$/);
      if (!match) return { effort: "MEDIUM", title: line, action: "" };
      return { effort: match[1], title: match[2], action: match[3] };
    });
}

export default function FixPlan({ findings }: { findings: Finding[] }) {
  const [state, setState] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [planText, setPlanText] = useState("");

  const handleGenerate = useCallback(async () => {
    setState("streaming");
    setPlanText("");

    try {
      const stream = await fetchFixPlanStream(findings);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setPlanText(fullText);
      }

      setState("done");
    } catch {
      setState("error");
    }
  }, [findings]);

  if (state === "idle") {
    return (
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          className="cta-btn !px-8 !py-4 !text-gold !bg-gold/[0.03]"
          style={{ animationDelay: "0s", opacity: 1, animation: "none" }}
        >
          <span className="text-xl">🛠️</span>
          Get The Fix Plan
        </button>
      </div>
    );
  }

  const lines = parsePlanLines(planText);
  const showRaw = state === "streaming" && lines.length === 0;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-gold flex items-center gap-2">
        <span>🛠️</span> The Fix Plan
      </h2>

      {showRaw && (
        <div className="glass-card p-5">
          <p className="text-text-dim whitespace-pre-wrap">{planText}</p>
          <span className="inline-block w-2 h-5 bg-gold animate-typewriter-cursor ml-0.5" />
        </div>
      )}

      {lines.map((item, i) => {
        const color = EFFORT_COLORS[item.effort] || "#ffd700";
        return (
          <div
            key={i}
            className="animate-slide-up glass-card p-5 relative overflow-hidden"
            style={{
              animationDelay: `${i * 100}ms`,
              opacity: 0,
            }}
          >
            <div
              className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full"
              style={{ background: color, boxShadow: `0 0 8px ${color}40` }}
            />
            <div className="flex items-start gap-3 pl-3">
              <span
                className="shrink-0 text-[0.6rem] font-mono font-medium tracking-[0.15em] uppercase px-2 py-0.5 rounded-md mt-1"
                style={{
                  color,
                  backgroundColor: `${color}10`,
                  border: `1px solid ${color}20`,
                }}
              >
                {item.effort}
              </span>
              <div className="flex-1">
                <h3 className="text-base font-display font-bold text-white">{item.title}</h3>
                {item.action && (
                  <p className="text-text-dim text-sm mt-1 leading-relaxed">{item.action}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {state === "streaming" && lines.length > 0 && (
        <div className="flex justify-center">
          <span className="inline-block w-2 h-5 bg-gold animate-typewriter-cursor" />
        </div>
      )}

      {state === "error" && (
        <div className="text-center">
          <p className="text-pink font-medium tracking-wide text-sm">
            Failed to generate fix plan
          </p>
          <button
            onClick={handleGenerate}
            className="mt-2 text-cyan font-medium tracking-wide text-sm hover:underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
