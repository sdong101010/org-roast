"use client";

import { useEffect, useRef } from "react";

export default function Aurora() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;

    let x = 0, y = 0, tx = 0, ty = 0;
    let hasEntered = false;
    let raf: number;

    function onMove(e: MouseEvent) {
      if (!glow || !dot) return;
      tx = e.clientX;
      ty = e.clientY;

      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;

      if (!hasEntered) {
        hasEntered = true;
        glow.style.opacity = "1";
        dot.style.opacity = "1";
        x = tx;
        y = ty;
      }
    }

    function onLeave() {
      if (!glow || !dot) return;
      glow.style.opacity = "0";
      dot.style.opacity = "0";
      hasEntered = false;
    }

    function animate() {
      if (!glow) return;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      raf = requestAnimationFrame(animate);
    }

    const interactiveEls = document.querySelectorAll("a, button, label, input, [role='button']");
    const enterHover = () => dot.classList.add("hovering");
    const leaveHover = () => dot.classList.remove("hovering");

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", enterHover);
      el.addEventListener("mouseleave", leaveHover);
    });

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", enterHover);
        el.removeEventListener("mouseleave", leaveHover);
      });
    };
  }, []);

  return (
    <>
      {/* Aurora gradient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="aurora-blob"
          style={{
            width: 600, height: 600,
            background: "rgba(124, 58, 237, 0.25)",
            top: "-10%", left: "-5%",
            animation: "drift-1 22s ease-in-out infinite alternate",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: 500, height: 500,
            background: "rgba(0, 245, 255, 0.18)",
            top: "30%", right: "-10%",
            animation: "drift-2 26s ease-in-out infinite alternate",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: 450, height: 450,
            background: "rgba(255, 51, 102, 0.15)",
            bottom: "-5%", left: "30%",
            animation: "drift-3 20s ease-in-out infinite alternate",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: 350, height: 350,
            background: "rgba(255, 215, 0, 0.08)",
            top: "60%", left: "10%",
            animation: "drift-2 30s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      {/* Cursor glow follower */}
      <div
        ref={glowRef}
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        style={{
          opacity: 0,
          transition: "opacity 0.4s ease",
          background: "radial-gradient(circle, rgba(0,245,255,0.18), transparent 35%), radial-gradient(circle, rgba(124,58,237,0.08), transparent 60%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Custom dot cursor */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0 }}
      />
    </>
  );
}
