"use client";

import { useState } from "react";
import { Finding } from "@/lib/analyzers/types";

const CATEGORY_COLORS: Record<string, string> = {
  metadata: "#00f5ff",
  code: "#ff3366",
  security: "#ffd700",
  config: "#39ff14",
  limits: "#7c3aed",
  agentforce: "#a855f7",
  datacloud: "#38bdf8",
};

const CATEGORY_ICONS: Record<string, string> = {
  metadata: "🗃️",
  code: "💻",
  security: "🔒",
  config: "⚙️",
  limits: "📊",
  agentforce: "🤖",
  datacloud: "☁️",
};

export default function RoastCard({
  finding,
  index,
}: {
  finding: Finding;
  index: number;
}) {
  const [showFix, setShowFix] = useState(false);
  const flames = Array.from({ length: 5 }, (_, i) => i < finding.severity);
  const color = CATEGORY_COLORS[finding.category] || "#7c3aed";

  return (
    <div
      className="animate-slide-up glass-card p-5 relative overflow-hidden"
      style={{
        animationDelay: `${index * 120}ms`,
        opacity: 0,
      }}
    >
      {/* Left accent line */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}40` }}
      />

      <div className="flex items-start justify-between gap-4 pl-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {CATEGORY_ICONS[finding.category] || "📋"}
            </span>
            <span
              className="text-[0.65rem] font-mono font-medium uppercase tracking-[0.15em] px-2 py-0.5 rounded-md"
              style={{
                color,
                backgroundColor: `${color}10`,
                border: `1px solid ${color}20`,
              }}
            >
              {finding.category}
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white mb-1">{finding.title}</h3>
          <p className="text-text-dim text-sm leading-relaxed">
            {finding.description}
          </p>
        </div>
        <div className="flex gap-0.5 shrink-0 pt-1">
          {flames.map((lit, i) => (
            <span
              key={i}
              className={`text-base ${lit ? "animate-flame" : "opacity-20 grayscale"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              🔥
            </span>
          ))}
        </div>
      </div>

      {finding.remediation && (
        <div className="mt-3 pt-3 border-t border-white/[0.04] pl-3">
          <button
            onClick={() => setShowFix(!showFix)}
            className="flex items-center gap-2 text-sm text-cyan/70 hover:text-cyan transition-colors cursor-pointer font-medium tracking-wide"
          >
            <span
              className="text-xs transition-transform duration-200"
              style={{ transform: showFix ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              ▶
            </span>
            How to fix this
          </button>
          {showFix && (
            <p className="mt-2 text-sm text-cyan/50 leading-relaxed pl-5">
              {finding.remediation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
