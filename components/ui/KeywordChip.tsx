"use client";

import type { ExtractedKeyword } from "@/lib/types";

interface KeywordChipProps {
  keyword: ExtractedKeyword;
  matched?: boolean;
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  hard_skill: { bg: "#1a0a2e", border: "#7F77DD50", text: "#AFA9EC" },
  soft_skill: { bg: "#0a1a0a", border: "#3d8c5a50", text: "#5dca9e" },
  tool: { bg: "#0a0f1f", border: "#3456b350", text: "#7aa8ec" },
  qualification: { bg: "#1f150a", border: "#b3822050", text: "#efb927" },
};

const importanceDot: Record<string, string> = {
  high: "#e05252",
  medium: "#efb927",
  low: "#7F77DD",
};

export default function KeywordChip({ keyword, matched }: KeywordChipProps) {
  const colors = categoryColors[keyword.category] ?? categoryColors.hard_skill;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 500,
        background: matched ? "#0f2a18" : colors.bg,
        border: `0.5px solid ${matched ? "#2a7a4a" : colors.border}`,
        color: matched ? "#5dca9e" : colors.text,
        transition: "all 0.2s",
        cursor: "default",
      }}
      title={`${keyword.category.replace("_", " ")} · ${keyword.importance} priority · seen ${keyword.frequency}x`}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: matched ? "#5dca9e" : importanceDot[keyword.importance],
          flexShrink: 0,
        }}
      />
      {keyword.keyword}
      {matched && (
        <span style={{ fontSize: 10, opacity: 0.7 }}>✓</span>
      )}
    </span>
  );
}
