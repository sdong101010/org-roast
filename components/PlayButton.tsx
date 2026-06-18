"use client";

import { useState, useRef, useCallback } from "react";
import { fetchRoastAudio } from "@/lib/api-client";

export default function PlayButton({ roastText }: { roastText: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const handlePlay = useCallback(async () => {
    if (state === "playing" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState("idle");
      return;
    }

    if (blobUrlRef.current) {
      playAudio(blobUrlRef.current);
      return;
    }

    setState("loading");

    try {
      const blob = await fetchRoastAudio(roastText);
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      playAudio(url);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [roastText, state]);

  function playAudio(url: string) {
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setState("idle");
    audio.onerror = () => setState("error");
    audio.play();
    setState("playing");
  }

  const label = {
    idle: "Play Roast",
    loading: "Loading...",
    playing: "Stop",
    error: "Failed",
  }[state];

  const icon = {
    idle: "▶",
    loading: "⏳",
    playing: "⏹",
    error: "✕",
  }[state];

  return (
    <button
      onClick={handlePlay}
      disabled={state === "loading"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-display font-bold tracking-wide uppercase transition-all cursor-pointer
        ${state === "playing"
          ? "bg-cyan text-[#06060c] shadow-[0_0_30px_rgba(0,245,255,0.4)] scale-105"
          : state === "loading"
            ? "bg-white/[0.03] text-text-faint cursor-wait border border-white/[0.06]"
            : state === "error"
              ? "bg-pink/10 text-pink border border-pink/20"
              : "bg-white/[0.03] border border-white/[0.06] text-foreground hover:border-cyan/30 hover:text-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.1)] hover:scale-105"
        }`}
    >
      <span className={`text-base ${state === "playing" ? "animate-pulse" : ""}`}>
        {icon}
      </span>
      {label}
      {state === "playing" && (
        <span className="flex gap-0.5 items-end h-4">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 bg-[#06060c] rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.6s",
                height: `${8 + Math.random() * 8}px`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
