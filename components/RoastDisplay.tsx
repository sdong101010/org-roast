"use client";

import { useState, useCallback, useEffect, useRef, type RefObject } from "react";

interface RoastDisplayProps {
  roastText: string;
  isStreaming?: boolean;
  audioRef?: RefObject<HTMLAudioElement | null>;
}

export default function RoastDisplay({
  roastText,
  isStreaming = false,
  audioRef,
}: RoastDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const lastIndexRef = useRef(-1);
  const rafRef = useRef<number>(0);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(roastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roastText]);

  const karaoke = isStreaming && !!audioRef;

  const tokens = karaoke ? roastText.split(/(\s+)/) : [];
  const wordCount = karaoke
    ? tokens.reduce((n, t) => n + (t.trim() ? 1 : 0), 0)
    : 0;

  useEffect(() => {
    if (!karaoke) {
      lastIndexRef.current = -1;
      setHighlightIndex(-1);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        const progress = audio.currentTime / audio.duration;
        const idx = Math.floor(progress * wordCount);
        if (idx !== lastIndexRef.current) {
          lastIndexRef.current = idx;
          setHighlightIndex(idx);
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [karaoke, audioRef, wordCount]);

  const renderKaraoke = () => {
    let wi = 0;
    return tokens.map((token, i) => {
      if (!token.trim()) {
        const newlines = token.match(/\n/g);
        if (newlines) {
          return (
            <span key={i}>
              {newlines.map((_, j) => (
                <br key={j} />
              ))}
            </span>
          );
        }
        return <span key={i}>{token}</span>;
      }

      const currentWi = wi;
      wi++;

      const sung = currentWi < highlightIndex;
      const active = currentWi === highlightIndex;
      const upcoming = currentWi > highlightIndex;

      return (
        <span
          key={i}
          className="transition-colors duration-150"
          style={{
            color: active
              ? "#00f5ff"
              : sung
                ? "#e4e4e7"
                : upcoming
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.18)",
            textShadow: active ? "0 0 12px rgba(0,245,255,0.5)" : "none",
          }}
        >
          {token}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
          <span className="text-2xl">🎤</span>
          <h2 className="font-display text-lg font-bold tracking-wide text-cyan">
            The Roast
          </h2>
          <div className="flex gap-0.5 ml-auto items-end">
            {[3, 5, 4, 7, 3, 6, 4, 5].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all"
                style={{
                  height: `${h * 3}px`,
                  backgroundColor: isStreaming ? "#00f5ff" : "rgba(255,255,255,0.04)",
                  opacity: isStreaming ? 0.6 : 0.4,
                  animation: isStreaming ? `eq-bar 0.8s ease-in-out ${i * 0.1}s infinite` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap min-h-[200px]">
          {karaoke ? (
            renderKaraoke()
          ) : (
            <span className="text-zinc-300">{roastText}</span>
          )}
        </div>

        {!isStreaming && roastText && (
          <div className="flex items-center justify-end mt-6 pt-4 border-t border-white/[0.06]">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                         text-sm font-medium tracking-wide text-text-dim
                         border border-white/[0.06] hover:border-white/[0.12]
                         hover:text-foreground transition-all cursor-pointer"
            >
              {copied ? "Copied!" : "Copy bars"}
              <span>{copied ? "✅" : "📋"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
