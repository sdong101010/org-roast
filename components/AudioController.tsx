"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";

interface AudioControllerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function AudioController({ audioRef }: AudioControllerProps) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted, audioRef]);

  const toggle = useCallback(() => setMuted((m) => !m), []);

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute" : "Mute"}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer
        ${muted
          ? "bg-white/[0.03] border border-white/[0.06] text-text-dim hover:text-foreground hover:border-white/[0.12]"
          : "bg-cyan/10 border border-cyan/20 text-cyan shadow-[0_0_15px_rgba(0,245,255,0.15)]"
        }`}
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
