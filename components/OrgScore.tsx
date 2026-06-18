"use client";

import { useState, useEffect } from "react";
import { OrgGrade } from "@/lib/score";

const GRADE_COLORS: Record<string, string> = {
  A: "#39ff14",
  B: "#ffd700",
  C: "#ff6b35",
  D: "#ff3366",
  F: "#ff0000",
};

const RADIUS = 80;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function OrgScore({
  grade,
  onComplete,
  isLoading = false,
}: {
  grade: OrgGrade;
  onComplete: () => void;
  isLoading?: boolean;
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * grade.score));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setAnimationDone(true);
      }
    }

    requestAnimationFrame(tick);
  }, [grade.score]);

  const color = GRADE_COLORS[grade.letter];
  const offset = CIRCUMFERENCE - (displayScore / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={STROKE}
          />
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              transition: "stroke 0.3s ease",
              filter: `drop-shadow(0 0 12px ${color}60)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-display font-extrabold tabular-nums tracking-tight"
            style={{ color }}
          >
            {displayScore}
          </span>
          <span className="text-text-faint text-sm font-mono tracking-widest">/ 100</span>
        </div>
      </div>

      <div
        className={`text-center space-y-2 transition-opacity duration-500 ${
          animationDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="text-5xl font-display font-extrabold"
          style={{ color, textShadow: `0 0 20px ${color}40` }}
        >
          {grade.letter}
        </div>
        <p className="text-text-dim text-lg font-medium tracking-wide">
          {grade.label}
        </p>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className={`cta-btn !text-sm !px-8 !py-3 mt-4 ${isLoading ? "!cursor-wait" : ""}`}
          style={{ opacity: 1, animation: "none" }}
        >
          {isLoading ? (
            <>
              <span className="flex gap-0.5 items-end h-4">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1 bg-cyan rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "0.6s",
                      height: `${8 + Math.random() * 8}px`,
                    }}
                  />
                ))}
              </span>
              Cooking...
            </>
          ) : (
            <>
              <span>🔥</span>
              Get Smoked
            </>
          )}
        </button>
      </div>
    </div>
  );
}
