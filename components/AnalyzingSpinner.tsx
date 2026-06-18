"use client";

import { useState, useEffect } from "react";

const PHASES = [
  { message: "Connecting to the cypher...", icon: "🔌" },
  { message: "Scanning metadata...", icon: "🗃️" },
  { message: "Reading your Apex... yikes", icon: "💀" },
  { message: "Checking security posture...", icon: "🔓" },
  { message: "Auditing config & automations...", icon: "⚙️" },
  { message: "Checking governor limits...", icon: "📊" },
  { message: "Looking for Agentforce agents...", icon: "🤖" },
  { message: "Probing Data Cloud...", icon: "☁️" },
  { message: "Writing your diss track...", icon: "🎤" },
];

export default function AnalyzingSpinner({
  phase,
}: {
  phase: "analyzing" | "roasting";
}) {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const startIndex = phase === "roasting" ? PHASES.length - 1 : 0;
    setCurrentPhase(startIndex);

    if (phase === "analyzing") {
      const interval = setInterval(() => {
        setCurrentPhase((prev) => {
          if (prev >= PHASES.length - 2) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const current = PHASES[currentPhase];

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Pulsing ring spinner */}
      <div className="relative w-28 h-28">
        <div
          className="absolute inset-0 rounded-full border border-cyan/20"
          style={{ animation: "pulse-ring 2.5s ease-in-out infinite" }}
        />
        <div
          className="absolute inset-2 rounded-full border border-purple/15"
          style={{ animation: "pulse-ring 2.5s ease-in-out 0.5s infinite" }}
        />
        <div
          className="absolute inset-4 rounded-full border border-pink/10"
          style={{ animation: "pulse-ring 2.5s ease-in-out 1s infinite" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">{current.icon}</span>
        </div>
        {/* Rotating dot */}
        <div
          className="absolute inset-0"
          style={{ animation: "spin-slow 3s linear infinite" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-lg font-display font-bold tracking-wide text-foreground">
          {current.message}
        </p>
        {/* Progress pips */}
        <div className="flex items-center justify-center gap-2">
          {PHASES.slice(0, phase === "roasting" ? PHASES.length : PHASES.length - 1).map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i <= currentPhase ? 24 : 8,
                backgroundColor: i <= currentPhase ? "#00f5ff" : "rgba(255,255,255,0.06)",
                boxShadow: i <= currentPhase ? "0 0 6px rgba(0,245,255,0.4)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
