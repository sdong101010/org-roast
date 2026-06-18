"use client";

type Props = {
  isPlaying: boolean;
  disabled: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export default function RoastSongButton({
  isPlaying,
  disabled,
  onPlay,
  onStop,
}: Props) {
  return (
    <button
      type="button"
      onClick={isPlaying ? onStop : onPlay}
      disabled={disabled && !isPlaying}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-display font-bold tracking-wide uppercase transition-all cursor-pointer
        ${isPlaying
          ? "bg-cyan text-[#06060c] shadow-[0_0_30px_rgba(0,245,255,0.4)] scale-105"
          : disabled
            ? "bg-white/[0.03] text-text-faint cursor-not-allowed border border-white/[0.06]"
            : "bg-white/[0.03] border border-white/[0.06] text-foreground hover:border-cyan/30 hover:text-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.1)] hover:scale-105"
        }`}
    >
      <span className={`text-base ${isPlaying ? "animate-pulse" : ""}`}>
        {isPlaying ? "⏹" : "▶"}
      </span>
      {isPlaying ? "Stop song" : "Play song"}
      {isPlaying && (
        <span className="flex gap-0.5 items-end h-4">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 bg-[#06060c] rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.6s",
                height: `${8 + (i % 3) * 4}px`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
