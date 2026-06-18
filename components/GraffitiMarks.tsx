export default function GraffitiMarks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Crown (top-left) */}
      <div className="graf-mark" style={{ top: "10%", left: "5%", width: 110, transform: "rotate(-12deg)", animationDelay: "0.6s", ["--final-opacity" as string]: 0.2 }}>
        <svg viewBox="0 0 60 45" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="5,38 5,15 15,25 30,5 45,25 55,15 55,38" />
          <line x1="5" y1="38" x2="55" y2="38" />
        </svg>
      </div>
      {/* Star (top-right) */}
      <div className="graf-mark" style={{ top: "14%", right: "8%", width: 70, transform: "rotate(18deg)", animationDelay: "1.0s", ["--final-opacity" as string]: 0.17 }}>
        <svg viewBox="0 0 50 50" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="25,3 31,18 48,18 34,28 39,44 25,34 11,44 16,28 2,18 19,18" />
        </svg>
      </div>
      {/* Arrow (mid-left) */}
      <div className="graf-mark" style={{ top: "52%", left: "3%", width: 90, transform: "rotate(-5deg)", animationDelay: "1.3s", ["--final-opacity" as string]: 0.16 }}>
        <svg viewBox="0 0 60 30" fill="none" stroke="#ff3366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="15" x2="48" y2="15" />
          <polyline points="38,5 50,15 38,25" />
        </svg>
      </div>
      {/* X mark (bottom-right) */}
      <div className="graf-mark" style={{ bottom: "16%", right: "6%", width: 50, transform: "rotate(22deg)", animationDelay: "1.6s", ["--final-opacity" as string]: 0.18 }}>
        <svg viewBox="0 0 30 30" fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="5" x2="25" y2="25" />
          <line x1="25" y1="5" x2="5" y2="25" />
        </svg>
      </div>
      {/* Lightning (right) */}
      <div className="graf-mark" style={{ top: "32%", right: "4%", width: 45, transform: "rotate(8deg)", animationDelay: "1.8s", ["--final-opacity" as string]: 0.18 }}>
        <svg viewBox="0 0 30 55" fill="none" stroke="#ffd700" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22,2 8,24 18,24 8,52" />
        </svg>
      </div>
      {/* Circle (bottom-left) */}
      <div className="graf-mark" style={{ bottom: "25%", left: "8%", width: 60, transform: "rotate(-8deg)", animationDelay: "1.4s", ["--final-opacity" as string]: 0.14 }}>
        <svg viewBox="0 0 40 40" fill="none" stroke="#7c3aed" strokeWidth="1.5">
          <circle cx="20" cy="20" r="16" />
        </svg>
      </div>
      {/* Drips (left) */}
      <div className="graf-mark" style={{ top: "28%", left: "9%", width: 22, transform: "rotate(2deg)", animationDelay: "1.1s", ["--final-opacity" as string]: 0.2 }}>
        <svg viewBox="0 0 20 60" fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="0" x2="5" y2="40" />
          <circle cx="5" cy="44" r="3" />
          <line x1="14" y1="5" x2="14" y2="30" />
          <circle cx="14" cy="34" r="2.5" />
        </svg>
      </div>
      {/* Hashtag (mid-right) */}
      <div className="graf-mark" style={{ top: "60%", right: "10%", width: 45, transform: "rotate(-10deg)", animationDelay: "2.4s", ["--final-opacity" as string]: 0.15 }}>
        <svg viewBox="0 0 40 40" fill="none" stroke="#ff3366" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="8" y2="35" />
          <line x1="28" y1="5" x2="24" y2="35" />
          <line x1="4" y1="14" x2="34" y2="14" />
          <line x1="4" y1="26" x2="34" y2="26" />
        </svg>
      </div>
      {/* Mic (top-left inner) */}
      <div className="graf-mark" style={{ top: "6%", left: "22%", width: 28, transform: "rotate(-8deg)", animationDelay: "3.0s", ["--final-opacity" as string]: 0.15 }}>
        <svg viewBox="0 0 30 50" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="12" height="22" rx="6" />
          <path d="M5,20 C5,30 25,30 25,20" />
          <line x1="15" y1="30" x2="15" y2="40" />
          <line x1="8" y1="40" x2="22" y2="40" />
        </svg>
      </div>
      {/* Music notes (left) */}
      <div className="graf-mark" style={{ top: "66%", left: "7%", width: 40, transform: "rotate(10deg)", animationDelay: "2.9s", ["--final-opacity" as string]: 0.14 }}>
        <svg viewBox="0 0 40 45" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="8" x2="12" y2="35" />
          <circle cx="8" cy="36" r="5" />
          <line x1="32" y1="4" x2="32" y2="30" />
          <circle cx="28" cy="31" r="5" />
          <line x1="12" y1="8" x2="32" y2="4" />
        </svg>
      </div>
      {/* Headphones (right) */}
      <div className="graf-mark" style={{ bottom: "48%", right: "3%", width: 45, transform: "rotate(5deg)", animationDelay: "3.2s", ["--final-opacity" as string]: 0.12 }}>
        <svg viewBox="0 0 50 45" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round">
          <path d="M5,28 C5,12 45,12 45,28" />
          <rect x="2" y="26" width="8" height="14" rx="3" />
          <rect x="40" y="26" width="8" height="14" rx="3" />
        </svg>
      </div>
      {/* Eye (right upper) */}
      <div className="graf-mark" style={{ top: "20%", right: "20%", width: 50, transform: "rotate(-5deg)", animationDelay: "2.1s", ["--final-opacity" as string]: 0.13 }}>
        <svg viewBox="0 0 50 30" fill="none" stroke="#ff3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3,15 C10,5 40,5 47,15 C40,25 10,25 3,15Z" />
          <circle cx="25" cy="15" r="5" />
        </svg>
      </div>
      {/* Crown 2 (pink, bottom-right) */}
      <div className="graf-mark" style={{ bottom: "38%", right: "12%", width: 75, transform: "rotate(6deg)", animationDelay: "2.0s", ["--final-opacity" as string]: 0.14 }}>
        <svg viewBox="0 0 60 45" fill="none" stroke="#ff3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="5,38 5,15 15,25 30,5 45,25 55,15 55,38" />
          <line x1="5" y1="38" x2="55" y2="38" />
        </svg>
      </div>
      {/* Arrow diagonal (top-center) */}
      <div className="graf-mark" style={{ top: "7%", left: "38%", width: 65, transform: "rotate(30deg)", animationDelay: "2.2s", ["--final-opacity" as string]: 0.12 }}>
        <svg viewBox="0 0 60 30" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="15" x2="48" y2="15" />
          <polyline points="38,5 50,15 38,25" />
        </svg>
      </div>
      {/* Diamond (top, between title gap) */}
      <div className="graf-mark" style={{ top: "22%", right: "25%", width: 38, transform: "rotate(45deg)", animationDelay: "1.7s", ["--final-opacity" as string]: 0.13 }}>
        <svg viewBox="0 0 30 30" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinejoin="round">
          <rect x="5" y="5" width="20" height="20" />
        </svg>
      </div>
      {/* Spiral/swirl (left side) */}
      <div className="graf-mark" style={{ top: "42%", left: "6%", width: 55, transform: "rotate(15deg)", animationDelay: "2.6s", ["--final-opacity" as string]: 0.13 }}>
        <svg viewBox="0 0 50 50" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
          <path d="M25,25 C25,20 30,18 33,22 C36,26 32,32 26,30 C20,28 18,22 22,17 C26,12 34,14 37,20" />
        </svg>
      </div>
      {/* Starburst (bottom center) */}
      <div className="graf-mark" style={{ bottom: "10%", left: "45%", width: 35, transform: "rotate(5deg)", animationDelay: "2.8s", ["--final-opacity" as string]: 0.16 }}>
        <svg viewBox="0 0 30 30" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round">
          <line x1="15" y1="2" x2="15" y2="28" />
          <line x1="2" y1="15" x2="28" y2="15" />
          <line x1="5" y1="5" x2="25" y2="25" />
          <line x1="25" y1="5" x2="5" y2="25" />
        </svg>
      </div>
      {/* Wavy scribble (left low) */}
      <div className="graf-mark" style={{ bottom: "30%", left: "2%", width: 100, transform: "rotate(-3deg)", animationDelay: "1.9s", ["--final-opacity" as string]: 0.12 }}>
        <svg viewBox="0 0 80 15" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2,8 C10,4 18,12 28,7 C38,2 45,13 55,8 C65,3 72,11 78,7" />
        </svg>
      </div>
      {/* Three dots (bottom left) */}
      <div className="graf-mark" style={{ bottom: "42%", left: "14%", width: 40, animationDelay: "2.3s", ["--final-opacity" as string]: 0.17 }}>
        <svg viewBox="0 0 40 12" fill="none">
          <circle cx="6" cy="6" r="3.5" stroke="#00f5ff" strokeWidth="1.5" />
          <circle cx="20" cy="6" r="3.5" stroke="#7c3aed" strokeWidth="1.5" />
          <circle cx="34" cy="6" r="3.5" stroke="#ff3366" strokeWidth="1.5" />
        </svg>
      </div>
      {/* Drip marks 2 (right side) */}
      <div className="graf-mark" style={{ top: "45%", right: "8%", width: 18, transform: "rotate(-2deg)", animationDelay: "3.4s", ["--final-opacity" as string]: 0.18 }}>
        <svg viewBox="0 0 16 55" fill="none" stroke="#ff3366" strokeWidth="1.8" strokeLinecap="round">
          <line x1="4" y1="0" x2="4" y2="35" />
          <circle cx="4" cy="39" r="2.5" />
          <line x1="12" y1="8" x2="12" y2="28" />
          <circle cx="12" cy="31" r="2" />
        </svg>
      </div>
      {/* Small crown (bottom center-right) */}
      <div className="graf-mark" style={{ bottom: "5%", right: "30%", width: 50, transform: "rotate(-15deg)", animationDelay: "3.1s", ["--final-opacity" as string]: 0.11 }}>
        <svg viewBox="0 0 60 45" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="5,38 5,15 15,25 30,5 45,25 55,15 55,38" />
          <line x1="5" y1="38" x2="55" y2="38" />
        </svg>
      </div>
      {/* Crosshair (center-left) */}
      <div className="graf-mark" style={{ top: "38%", left: "18%", width: 30, animationDelay: "3.5s", ["--final-opacity" as string]: 0.10 }}>
        <svg viewBox="0 0 30 30" fill="none" stroke="#00f5ff" strokeWidth="1.2" strokeLinecap="round">
          <circle cx="15" cy="15" r="10" />
          <line x1="15" y1="2" x2="15" y2="8" />
          <line x1="15" y1="22" x2="15" y2="28" />
          <line x1="2" y1="15" x2="8" y2="15" />
          <line x1="22" y1="15" x2="28" y2="15" />
        </svg>
      </div>
      {/* Broken rectangle / frame (top right inner) */}
      <div className="graf-mark" style={{ top: "5%", right: "30%", width: 55, transform: "rotate(4deg)", animationDelay: "3.3s", ["--final-opacity" as string]: 0.09 }}>
        <svg viewBox="0 0 50 35" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
          <line x1="2" y1="2" x2="20" y2="2" />
          <line x1="2" y1="2" x2="2" y2="15" />
          <line x1="48" y1="33" x2="30" y2="33" />
          <line x1="48" y1="33" x2="48" y2="20" />
        </svg>
      </div>
      {/* Zigzag (bottom left) */}
      <div className="graf-mark" style={{ bottom: "15%", left: "20%", width: 70, transform: "rotate(-6deg)", animationDelay: "3.6s", ["--final-opacity" as string]: 0.10 }}>
        <svg viewBox="0 0 70 20" fill="none" stroke="#ff3366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,15 12,5 22,15 32,5 42,15 52,5 62,15" />
        </svg>
      </div>
      {/* Exclamation (far right) */}
      <div className="graf-mark" style={{ top: "72%", right: "5%", width: 15, transform: "rotate(12deg)", animationDelay: "3.7s", ["--final-opacity" as string]: 0.16 }}>
        <svg viewBox="0 0 12 40" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="2" x2="6" y2="28" />
          <circle cx="6" cy="35" r="2.5" />
        </svg>
      </div>
    </div>
  );
}
