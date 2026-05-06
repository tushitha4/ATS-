"use client";

import { useEffect, useState } from "react";

interface ATSScoreRingProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export default function ATSScoreRing({ score, size = 120, showLabel = true }: ATSScoreRingProps) {
  const [animated, setAnimated] = useState(0);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (animated / 100) * circumference;

  const color =
    score >= 75 ? "#5dca9e" :
    score >= 50 ? "#efb927" :
    score >= 25 ? "#e07b39" :
    "#e05252";

  const label =
    score >= 75 ? "Excellent" :
    score >= 50 ? "Good" :
    score >= 25 ? "Fair" :
    "Needs Work";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#26215C"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            style={{ transition: "stroke-dashoffset 1s ease, stroke 0.3s ease" }}
          />
        </svg>
        {/* Score text */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.22,
            color: color,
            lineHeight: 1,
            transition: "color 0.3s ease",
          }}>
            {score}
          </span>
          <span style={{ fontSize: size * 0.1, color: "var(--text-muted)", marginTop: 2 }}>
            / 100
          </span>
        </div>
      </div>
      {showLabel && (
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
