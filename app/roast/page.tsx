"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Aurora from "@/components/Aurora";
import AnalyzingSpinner from "@/components/AnalyzingSpinner";
import OrgScore from "@/components/OrgScore";
import RoastCard from "@/components/RoastCard";
import RoastDisplay from "@/components/RoastDisplay";
import RoastSongButton from "@/components/RoastSongButton";
import AudioController from "@/components/AudioController";
import ShareCard from "@/components/ShareCard";
import SlackShareButton from "@/components/SlackShareButton";
import FixPlan from "@/components/FixPlan";
import { Finding } from "@/lib/analyzers/types";
import { OrgGrade } from "@/lib/score";
import { analyzeOrg, fetchRoastStream, fetchRoastAudio } from "@/lib/api-client";

type Stage = "analyzing" | "score" | "review" | "streaming" | "error";
type RoastBuild = "idle" | "building" | "ready" | "failed";

export default function RoastPage() {
  const [stage, setStage] = useState<Stage>("analyzing");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [grade, setGrade] = useState<OrgGrade | null>(null);
  const [roastText, setRoastText] = useState("");
  const [roastBuild, setRoastBuild] = useState<RoastBuild>("idle");
  const [waitingForRoast, setWaitingForRoast] = useState(false);
  const [roastAudioReady, setRoastAudioReady] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const roastAudioUrlRef = useRef<string | null>(null);
  const roastTextRef = useRef("");
  const pendingContinueRef = useRef(false);

  const stopRoastAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audioRef.current = null;
    setStage("review");
  }, []);

  const playRoastAudio = useCallback(() => {
    const url = roastAudioUrlRef.current;
    if (!url) return;

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.volume = 1.0;

    audio.onended = () => {
      audioRef.current = null;
      setStage("review");
    };
    audio.play().catch(() => {});
    setStage("streaming");
  }, []);

  const buildRoast = useCallback(async (foundFindings: Finding[]) => {
    setRoastBuild("building");
    setRoastAudioReady(false);

    try {
      const roastStream = await fetchRoastStream(foundFindings);
      const reader = roastStream.getReader();

      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const blob = await fetchRoastAudio(fullText);
      roastAudioUrlRef.current = URL.createObjectURL(blob);
      roastTextRef.current = fullText;
      setRoastText(fullText);
      setRoastBuild("ready");
      setRoastAudioReady(true);

      if (pendingContinueRef.current) {
        pendingContinueRef.current = false;
        setWaitingForRoast(false);
        setStage("review");
      }
    } catch (err) {
      setRoastBuild("failed");
      setRoastAudioReady(false);
      if (pendingContinueRef.current) {
        pendingContinueRef.current = false;
        setWaitingForRoast(false);
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStage("error");
      }
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    try {
      setStage("analyzing");

      const { findings: foundFindings, grade: orgGrade } = await analyzeOrg();
      setFindings(foundFindings);
      setGrade(orgGrade);
      setStage("score");

      buildRoast(foundFindings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  }, [buildRoast]);

  const handleContinueToRoast = useCallback(() => {
    if (roastBuild === "ready") {
      setRoastText(roastTextRef.current);
      setStage("review");
    } else if (roastBuild === "building") {
      pendingContinueRef.current = true;
      setWaitingForRoast(true);
    } else if (roastBuild === "failed") {
      setError("Roast generation failed");
      setStage("error");
    }
  }, [roastBuild]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  if (stage === "error") {
    return (
      <div className="relative min-h-screen">
        <Aurora />
        <div className="relative z-[2] flex flex-col flex-1 items-center justify-center min-h-screen px-6">
          <div className="text-center space-y-6">
            <div className="text-6xl">💀</div>
            <h1 className="text-3xl font-display font-extrabold text-pink">
              Connection Lost
            </h1>
            <p className="text-text-dim max-w-md">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="cta-btn !text-sm !px-6 !py-3"
                style={{ opacity: 1, animation: "none" }}
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-6 py-3 rounded-full text-sm font-display font-bold tracking-wide uppercase
                           border border-white/[0.06] text-text-dim hover:text-foreground hover:border-white/[0.12] transition-all"
              >
                Back Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "analyzing") {
    return (
      <div className="relative min-h-screen">
        <Aurora />
        <div className="relative z-[2] flex flex-col flex-1 items-center justify-center min-h-screen px-6">
          <AnalyzingSpinner phase="analyzing" />
        </div>
      </div>
    );
  }

  if (stage === "score" && grade) {
    return (
      <div className="relative min-h-screen">
        <Aurora />
        <div className="relative z-[2] flex flex-col flex-1 items-center justify-center min-h-screen px-6">
          <OrgScore grade={grade} onComplete={handleContinueToRoast} isLoading={waitingForRoast} />
        </div>
      </div>
    );
  }

  const isStreaming = stage === "streaming";
  const songDisabled = roastBuild !== "ready" || !roastAudioReady;

  return (
    <div className="relative min-h-screen">
      <Aurora />

      <div className="relative z-[2] flex flex-col flex-1 items-center min-h-screen px-6 py-12">
        <div className="w-full max-w-3xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-gradient">
                Your Org Got Roasted
              </h1>
              {isStreaming && <AudioController audioRef={audioRef} />}
              <RoastSongButton
                isPlaying={isStreaming}
                disabled={songDisabled}
                onPlay={playRoastAudio}
                onStop={stopRoastAudio}
              />
            </div>
            {grade && (
              <p className="text-text-dim text-sm font-medium tracking-wide">
                Score: <span className="font-bold text-foreground">{grade.score}/100</span>
                {" · "}
                {findings.length} issue{findings.length !== 1 ? "s" : ""} found.{" "}
                {grade.label}.
              </p>
            )}
          </div>

          {/* The Roast */}
          <RoastDisplay roastText={roastText} isStreaming={isStreaming} audioRef={audioRef} />

          {/* Findings Cards — visible during review and streaming so you can scroll anytime */}
          {findings.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <span>📋</span> The Evidence
              </h2>
              {findings.map((finding, i) => (
                <RoastCard key={i} finding={finding} index={i} />
              ))}
            </div>
          )}

          {/* Fix Plan */}
          {findings.length > 0 && <FixPlan findings={findings} />}

          {/* Share Card */}
          {grade && <ShareCard grade={grade} findings={findings} />}

          {/* Slack Share */}
          {grade && (
            <div className="flex justify-center">
              <SlackShareButton grade={grade} findings={findings} />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center pt-4 pb-8">
            <a href="/" className="cta-btn !text-sm" style={{ opacity: 1, animation: "none" }}>
              <span>🎤</span>
              Roast Another Org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
