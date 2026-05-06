"use client";

import { useState } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { JDAnalysisResult } from "@/lib/types";
import KeywordChip from "@/components/ui/KeywordChip";

interface JDAnalyzerProps {
  onAnalysisComplete: (result: JDAnalysisResult) => void;
  matchedKeywords?: string[];
}

export default function JDAnalyzer({ onAnalysisComplete, matchedKeywords = [] }: JDAnalyzerProps) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    hardSkills: true,
    softSkills: false,
    tools: false,
    qualifications: false,
  });

  const analyze = async () => {
    if (!jdText.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jdText }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      // Flatten allKeywords from categories
      const data = json.data as JDAnalysisResult;
      data.allKeywords = [
        ...(data.hardSkills ?? []),
        ...(data.softSkills ?? []),
        ...(data.tools ?? []),
        ...(data.qualifications ?? []),
      ];

      setResult(data);
      onAnalysisComplete(data);
    } catch (e: any) {
      setError(e.message ?? "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const sections = result
    ? [
        { key: "hardSkills", label: "Hard Skills", items: result.hardSkills, color: "#7F77DD" },
        { key: "softSkills", label: "Soft Skills", items: result.softSkills, color: "#5dca9e" },
        { key: "tools", label: "Tools & Tech", items: result.tools, color: "#7aa8ec" },
        { key: "qualifications", label: "Qualifications", items: result.qualifications, color: "#efb927" },
      ]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Input */}
      <div>
        <label className="label">Paste Job Description</label>
        <textarea
          className="input"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job description here…"
          style={{ minHeight: 140, fontSize: 13 }}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={analyze}
        disabled={loading || jdText.length < 50}
        style={{ alignSelf: "flex-start", opacity: jdText.length < 50 ? 0.5 : 1 }}
      >
        {loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
        {loading ? "Analyzing…" : "Analyze JD"}
      </button>

      {error && (
        <div style={{ fontSize: 13, color: "#e05252", padding: "8px 12px", background: "#1f0a0a", border: "0.5px solid #5a1f1f", borderRadius: "var(--radius-md)" }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
              {result.jobTitle}
            </span>
            {result.company && (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {result.company}</span>
            )}
            <span className="badge badge-purple" style={{ marginLeft: "auto" }}>
              {result.allKeywords.length} keywords
            </span>
          </div>

          {sections.map(({ key, label, items, color }) => {
            if (!items?.length) return null;
            const open = expanded[key];
            return (
              <div
                key={key}
                style={{
                  background: "var(--bg-surface)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpanded((p) => ({ ...p, [key]: !p[key] }))}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 2 }}>({items.length})</span>
                  <span style={{ marginLeft: "auto" }}>
                    {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </span>
                </button>

                {open && (
                  <div style={{ padding: "0 14px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map((kw) => (
                      <KeywordChip
                        key={kw.keyword}
                        keyword={kw}
                        matched={matchedKeywords.some(
                          (m) => m.toLowerCase() === kw.keyword.toLowerCase()
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
