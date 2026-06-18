"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Finding } from "@/lib/analyzers/types";
import { OrgGrade } from "@/lib/score";

const GRADE_COLORS: Record<string, string> = {
  A: "#39ff14",
  B: "#ffd700",
  C: "#ff6b35",
  D: "#ff3366",
  F: "#ff0000",
};

const GRADE_GLOW: Record<string, string> = {
  A: "rgba(57,255,20,0.15)",
  B: "rgba(255,215,0,0.15)",
  C: "rgba(255,107,53,0.15)",
  D: "rgba(255,51,102,0.15)",
  F: "rgba(255,0,0,0.15)",
};

const CATEGORY_LABELS: Record<string, { icon: string; color: string }> = {
  metadata: { icon: "M", color: "#00f5ff" },
  code: { icon: "C", color: "#ff3366" },
  security: { icon: "S", color: "#ffd700" },
  config: { icon: "G", color: "#39ff14" },
  limits: { icon: "L", color: "#7c3aed" },
  agentforce: { icon: "A", color: "#a855f7" },
  datacloud: { icon: "D", color: "#38bdf8" },
};

function ScoreRing({ score, color, size = 160 }: { score: number; color: string; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const gap = circumference - filled;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={circumference * 0.25}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

function SeverityDots({ severity, color }: { severity: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i < severity ? color : "rgba(255,255,255,0.08)",
            boxShadow: i < severity ? `0 0 4px ${color}80` : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function ShareCard({
  grade,
  findings,
}: {
  grade: OrgGrade;
  findings: Finding[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#06060c",
      });
      const link = document.createElement("a");
      link.download = "cypher-roast-card.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setGenerating(false);
    }
  }, []);

  const color = GRADE_COLORS[grade.letter] || "#ff0000";
  const glow = GRADE_GLOW[grade.letter] || "rgba(255,0,0,0.15)";
  const topFindings = findings.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* ── The exportable card ── */}
      <div
        ref={cardRef}
        style={{
          width: 520,
          padding: "36px 32px 28px",
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%, ${glow}, transparent),
            linear-gradient(170deg, #101018 0%, #08080e 40%, #06060c 100%)
          `,
          border: `1px solid rgba(255,255,255,0.06)`,
          borderRadius: 24,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🎤
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.12em",
                color: "#00f5ff",
                textTransform: "uppercase" as const,
              }}
            >
              The Cypher
            </span>
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            ORG ROAST
          </span>
        </div>

        {/* Score section */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginBottom: 28 }}>
          {/* Score ring */}
          <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
            <ScoreRing score={grade.score} color={color} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 48,
                  lineHeight: 1,
                  color,
                  letterSpacing: "-0.02em",
                }}
              >
                {grade.score}
              </span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase" as const,
                  marginTop: 4,
                }}
              >
                / 100
              </span>
            </div>
          </div>

          {/* Grade + label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 72,
                lineHeight: 1,
                color,
                textShadow: `0 0 40px ${color}30`,
              }}
            >
              {grade.letter}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 160,
                lineHeight: 1.4,
              }}
            >
              {grade.label}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

        {/* Findings */}
        {topFindings.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase" as const,
                marginBottom: 14,
              }}
            >
              Top Issues
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topFindings.map((f, i) => {
                const cat = CATEGORY_LABELS[f.category] || { icon: "?", color: "#7c3aed" };
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: `${cat.color}12`,
                        border: `1px solid ${cat.color}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 10,
                        color: cat.color,
                        flexShrink: 0,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.8)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      {f.title}
                    </span>
                    <SeverityDots severity={f.severity} color={color} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "rgba(0,245,255,0.3)",
              textTransform: "uppercase" as const,
            }}
          >
            The Cypher
          </span>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "0.05em",
            }}
          >
            Think your org is cleaner? Step up.
          </span>
        </div>
      </div>

      {/* ── Download button ── */}
      <button
        onClick={handleDownload}
        disabled={generating}
        className="flex items-center gap-2 px-6 py-3 rounded-full
                   text-sm font-display font-bold tracking-wide uppercase
                   border border-white/[0.06] text-text-dim
                   hover:border-gold/30 hover:text-gold hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]
                   transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
      >
        {generating ? "Generating..." : (
          <>
            <span>📸</span>
            Download Roast Card
          </>
        )}
      </button>
    </div>
  );
}
