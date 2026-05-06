"use client";

import { useState, useRef } from "react";
import { Download, Loader2, RefreshCw, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import JDAnalyzer from "@/components/jd/JDAnalyzer";
import ATSScoreRing from "@/components/ui/ATSScoreRing";
import { DEFAULT_RESUME } from "@/lib/defaults";
import type { ResumeData, JDAnalysisResult, ATSScoreResult } from "@/lib/types";

type Panel = "form" | "jd" | "score";

export default function BuilderPage() {
  const [resume, setResume] = useState<ResumeData>(DEFAULT_RESUME);
  const [jdResult, setJdResult] = useState<JDAnalysisResult | null>(null);
  const [atsScore, setAtsScore] = useState<ATSScoreResult | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>("form");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [scoringLoading, setScoringLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const targetKeywords = jdResult?.allKeywords?.map((k) => k.keyword) ?? [];
  const jobTitle = jdResult?.jobTitle ?? "Professional";

  const handleJDAnalysis = (result: JDAnalysisResult) => {
    setJdResult(result);
    setActivePanel("score");
    recalcScore(resume, result);
  };

  const recalcScore = async (r: ResumeData, jd: JDAnalysisResult | null) => {
    if (!jd?.allKeywords?.length) return;
    setScoringLoading(true);
    try {
      const res = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: r, keywords: jd.allKeywords.map((k) => k.keyword) }),
      });
      const json = await res.json();
      if (json.data) setAtsScore(json.data);
    } catch {}
    setScoringLoading(false);
  };

  const handleResumeChange = (updated: ResumeData) => {
    setResume(updated);
    if (jdResult) recalcScore(updated, jdResult);
  };

  const downloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const previewEl = previewRef.current;
      if (!previewEl) throw new Error("Preview not found");

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;margin:0;padding:0;}body{font-size:12px;}</style></head><body>${previewEl.innerHTML}</body></html>`;

      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, html }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "PDF generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.contact.name.replace(/\s+/g, "_")}_resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`PDF Error: ${e.message}\n\nNote: Puppeteer requires Chrome to be installed. You can use browser Print → Save as PDF as an alternative.`);
    }
    setDownloadingPdf(false);
  };

  const printResume = () => {
    const previewEl = previewRef.current;
    if (!previewEl) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${resume.contact.name} - Resume</title><style>*{box-sizing:border-box;margin:0;padding:0;}@media print{body{-webkit-print-color-adjust:exact;}}</style></head><body>${previewEl.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const panelTabs: { key: Panel; label: string }[] = [
    { key: "form", label: "Resume Editor" },
    { key: "jd", label: "Job Description" },
    { key: "score", label: `ATS Score${atsScore ? ` · ${atsScore.score}` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Toolbar */}
      <div style={{
        borderBottom: "0.5px solid var(--border)",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--bg-surface)",
      }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
          {resume.contact.name || "Untitled Resume"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={printResume}>
            Print / Save PDF
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: 12, padding: "6px 14px" }}
            onClick={downloadPdf}
            disabled={downloadingPdf}
          >
            {downloadingPdf ? <Loader2 size={12} className="spin" /> : <Download size={12} />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Main split layout */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 0 }}>

        {/* Left panel */}
        <div style={{
          borderRight: "0.5px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Panel tabs */}
          <div style={{ display: "flex", borderBottom: "0.5px solid var(--border)", padding: "0 20px" }}>
            {panelTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                style={{
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  borderBottom: activePanel === key ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                  color: activePanel === key ? "var(--accent-bright)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {activePanel === "form" && (
              <ResumeForm
                resume={resume}
                onChange={handleResumeChange}
                targetKeywords={targetKeywords}
                jobTitle={jobTitle}
              />
            )}

            {activePanel === "jd" && (
              <JDAnalyzer
                onAnalysisComplete={handleJDAnalysis}
                matchedKeywords={atsScore?.matchedKeywords ?? []}
              />
            )}

            {activePanel === "score" && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {!jdResult ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <Target size={32} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Analyze a job description to see your ATS score.</p>
                    <button className="btn btn-outline" style={{ marginTop: 12, fontSize: 12 }} onClick={() => setActivePanel("jd")}>
                      Go to Job Description
                    </button>
                  </div>
                ) : scoringLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                    <Loader2 size={24} className="spin" color="var(--accent)" />
                  </div>
                ) : atsScore ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ATSScoreRing score={atsScore.score} size={140} />
                    </div>

                    {atsScore.suggestions.length > 0 && (
                      <div>
                        <p className="label">Suggestions</p>
                        {atsScore.suggestions.map((s, i) => (
                          <div key={i} style={{
                            padding: "8px 12px",
                            background: "var(--bg-surface)",
                            border: "0.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            marginBottom: 6,
                          }}>
                            💡 {s}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ padding: 14, background: "#0f2218", border: "0.5px solid #2a5a3a", borderRadius: "var(--radius-md)" }}>
                        <p className="label" style={{ color: "#3d8c5a" }}>✓ Matched ({atsScore.matchedKeywords.length})</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                          {atsScore.matchedKeywords.map((k) => (
                            <span key={k} style={{ fontSize: 11, padding: "2px 8px", background: "#1a3a2a", borderRadius: 99, color: "#5dca9e" }}>{k}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ padding: 14, background: "#1f0a0a", border: "0.5px solid #5a1f1f", borderRadius: "var(--radius-md)" }}>
                        <p className="label" style={{ color: "#8c3d3d" }}>✗ Missing ({atsScore.missingKeywords.length})</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                          {atsScore.missingKeywords.map((k) => (
                            <span key={k} style={{ fontSize: 11, padding: "2px 8px", background: "#3a1a1a", borderRadius: 99, color: "#e05252" }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12, alignSelf: "flex-start" }}
                      onClick={() => recalcScore(resume, jdResult)}
                    >
                      <RefreshCw size={12} /> Recalculate
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Live Preview */}
        <div style={{
          background: "#e8e8e8",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 720,
            background: "#fff",
            boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
            borderRadius: 4,
            minHeight: 900,
            overflow: "hidden",
          }}>
            <div ref={previewRef}>
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
