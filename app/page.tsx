"use client";

import { useEffect, useRef } from "react";
import LoginButton from "@/components/LoginButton";
import Aurora from "@/components/Aurora";
import GraffitiMarks from "@/components/GraffitiMarks";

const FEATURES = [
  { icon: "🗃️", title: "Metadata", desc: "Custom objects, fields, page layouts, record types, flows, and automation sprawl.", accent: "#00f5ff", tall: true, stat: "~200 checks" },
  { icon: "💻", title: "Apex Code", desc: "Test coverage, triggers, batch jobs, and code quality signals.", accent: "#ff3366" },
  { icon: "🔒", title: "Security", desc: "Profiles, permission sets, sharing rules, and field-level access.", accent: "#ffd700" },
  { icon: "⚙️", title: "Config", desc: "Validation rules, workflows, process builders, and tech debt.", accent: "#39ff14" },
  { icon: "📊", title: "Limits", desc: "Governor limits, storage, API usage, and capacity warnings.", accent: "#7c3aed" },
  { icon: "🤖", title: "Agentforce", desc: "Agent configuration, topics, actions, and readiness.", accent: "#a855f7" },
  { icon: "☁️", title: "Data Cloud", desc: "Data streams, DMOs, identity resolution, and segmentation health.", accent: "#38bdf8", wide: true },
];

const STEPS = [
  { num: "01", icon: "🔌", title: "Connect", desc: "Log in with Salesforce OAuth. Read-only. Nothing is modified." },
  { num: "02", icon: "🔍", title: "Analyze", desc: "We scan metadata, code, security, config, and limits in real time." },
  { num: "03", icon: "🎤", title: "Roast", desc: "AI writes a custom diss track roasting every issue it finds." },
  { num: "04", icon: "📸", title: "Share", desc: "Download your roast card. Post to Slack. Show the team." },
];

function KineticTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.childNodes.length > 0) return;
    const text = "THE CYPHER";
    let idx = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        el.appendChild(document.createElement("br"));
      } else {
        const span = document.createElement("span");
        span.textContent = text[i];
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(50px) scale(0.9)";
        span.style.animation = `letter-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s forwards`;
        el.appendChild(span);
        idx++;
      }
    }
  }, []);

  return (
    <h1
      ref={ref}
      aria-label="THE CYPHER"
      className="font-display text-[clamp(3.5rem,13vw,12rem)] font-extrabold leading-[0.88] tracking-tight text-gradient mb-8"
    />
  );
}

function ScrollReveal({ children, className = "", style, onMouseMove }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`} style={style} onMouseMove={onMouseMove}>{children}</div>;
}

export default function Home() {
  return (
    <div className="relative">
      <Aurora />

      <div className="relative z-[2]">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-12 py-6 bg-[#06060c]/60 backdrop-blur-xl border-b border-white/[0.04]">
          <div className="font-display font-extrabold text-lg tracking-wide text-cyan">
            THE CYPHER
          </div>
          <a href="#how" className="text-[0.85rem] font-medium tracking-[0.1em] uppercase text-text-dim hover:text-foreground transition-colors">
            How It Works
          </a>
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center relative">
          <GraffitiMarks />
          <div className="relative z-10 flex flex-col items-center">
            <KineticTitle />
            <p className="text-[clamp(0.85rem,1.6vw,1.2rem)] font-light tracking-[0.25em] uppercase text-text-dim mb-3 opacity-0 animate-[fade-up_0.8s_ease_0.9s_forwards]">
              Think your Salesforce org is clean?
            </p>
            <p className="text-[clamp(0.95rem,1.8vw,1.35rem)] font-medium tracking-[0.15em] text-foreground mb-12 opacity-0 animate-[fade-up_0.8s_ease_1.1s_forwards]">
              Step into the cypher.
            </p>
            <div className="opacity-0 animate-[fade-up_0.8s_ease_1.3s_forwards]">
              <LoginButton />
            </div>
            <p className="mt-8 text-xs text-text-faint tracking-wide opacity-0 animate-[fade-up_0.8s_ease_1.5s_forwards]">
              Read-only metadata access · Nothing stored · Your secrets are safe
            </p>
          </div>
        </section>

        {/* Features — Bento Grid */}
        <section className="max-w-[1100px] mx-auto px-6 py-32">
          <ScrollReveal>
            <div className="font-mono text-[0.7rem] font-medium tracking-[0.3em] uppercase text-cyan mb-4">
              // capabilities
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight leading-tight mb-4">
              What We Analyze
            </h2>
            <p className="text-lg font-light text-text-dim max-w-[520px] leading-relaxed">
              Seven dimensions of your org, scanned in seconds. Every corner examined.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4 mt-14">
            {FEATURES.map((f, i) => (
              <ScrollReveal
                key={f.title}
                className={`glass-card p-7 flex flex-col justify-end overflow-hidden relative group
                  ${f.tall ? "min-[900px]:row-span-2" : ""}
                  ${f.wide ? "min-[600px]:col-span-2" : ""}`}
                style={{ transitionDelay: `${i * 0.05}s`, minHeight: f.tall ? 340 : 170 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                }}
              >
                <div
                  className="absolute top-6 right-6 w-2 h-2 rounded-full opacity-60"
                  style={{ background: f.accent }}
                />
                <div className="text-3xl mb-3 saturate-[1.2]">{f.icon}</div>
                <div className="font-display text-lg font-bold tracking-wide mb-1">{f.title}</div>
                <div className="text-[0.85rem] font-light text-text-dim leading-relaxed">{f.desc}</div>
                {f.stat && (
                  <div className="font-mono text-[0.7rem] text-text-faint mt-auto pt-4 tracking-wide">{f.stat}</div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-[60px] h-[2px] mx-auto bg-gradient-to-r from-cyan to-purple opacity-40" />

        {/* How It Works */}
        <section className="max-w-[1100px] mx-auto px-6 py-32" id="how">
          <ScrollReveal>
            <div className="font-mono text-[0.7rem] font-medium tracking-[0.3em] uppercase text-cyan mb-4">
              // process
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight leading-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg font-light text-text-dim max-w-[520px] leading-relaxed">
              Four steps. Under a minute. No installs, no packages, no agents.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-4 gap-6 mt-14 relative">
            {/* Connecting line */}
            <div className="hidden min-[900px]:block absolute top-[3.2rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {STEPS.map((s, i) => (
              <ScrollReveal key={s.num} className="text-center group" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="font-display text-4xl font-extrabold text-text-faint mb-4 group-hover:text-cyan transition-colors">
                  {s.num}
                </div>
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center text-2xl glass-card !rounded-2xl group-hover:border-cyan/20 group-hover:shadow-[0_0_30px_rgba(0,245,255,0.08)] transition-all">
                  {s.icon}
                </div>
                <div className="font-display font-bold text-base mb-2">{s.title}</div>
                <div className="text-sm font-light text-text-dim leading-relaxed">{s.desc}</div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-[60px] h-[2px] mx-auto bg-gradient-to-r from-cyan to-purple opacity-40" />

        {/* Final CTA */}
        <section className="max-w-[800px] mx-auto text-center px-6 py-40">
          <ScrollReveal>
            <div className="font-mono text-[0.7rem] font-medium tracking-[0.3em] uppercase text-cyan mb-4">
              // ready?
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold tracking-tight leading-tight mb-4 text-gradient">
              Step Up<br />To The Mic
            </h2>
            <p className="text-lg font-light text-text-dim max-w-[520px] mx-auto leading-relaxed mb-10">
              Your org has been hiding behind dashboards and reports. Time to face the music.
            </p>
            <LoginButton variant="large" />
          </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs text-text-faint tracking-[0.1em] border-t border-white/[0.04]">
          <span className="text-text-dim">THE CYPHER</span> · Built for Salesforce admins who can take a joke
        </footer>
      </div>
    </div>
  );
}
