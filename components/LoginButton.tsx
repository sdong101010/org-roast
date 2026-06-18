"use client";

import { useState } from "react";
import { IS_DEMO } from "@/lib/api-client";

export default function LoginButton({ variant = "default" }: { variant?: "default" | "large" }) {
  const [isSandbox, setIsSandbox] = useState(false);

  const handleLogin = () => {
    if (IS_DEMO) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      window.location.href = `${base}/roast`;
      return;
    }
    const url = `/api/auth/login${isSandbox ? "?sandbox=true" : ""}`;
    window.location.href = url;
  };

  const isLarge = variant === "large";

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleLogin}
        className={`cta-btn ${isLarge ? "cta-btn-lg" : ""}`}
        style={isLarge ? { opacity: 1, animation: "none" } : undefined}
      >
        <span className="text-xl">{isLarge ? "🔥" : "🎤"}</span>
        {IS_DEMO ? "See The Demo" : "Enter The Cypher"}
      </button>

      {!IS_DEMO && (
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs font-medium tracking-[0.12em] uppercase text-text-dim">
          Production
        </span>
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            checked={isSandbox}
            onChange={(e) => setIsSandbox(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className="w-[42px] h-6 rounded-full border transition-colors
                       bg-white/[0.08] border-white/[0.06]
                       peer-checked:bg-cyan/20 peer-checked:border-cyan/30"
          />
          <div
            className="absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-foreground rounded-full
                       transition-transform peer-checked:translate-x-[18px]"
          />
        </label>
        <span className="text-xs font-medium tracking-[0.12em] uppercase text-text-faint">
          Sandbox
        </span>
      </div>
      )}
    </div>
  );
}
