"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Trash2, Edit2, Download, Zap, Crown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface SavedResume {
  id: string;
  name: string;
  targetJob: string;
  atsScore: number;
  template: string;
  updatedAt: string;
}

const DEMO_RESUMES: SavedResume[] = [
  { id: "1", name: "Alex Johnson", targetJob: "Senior Software Engineer @ TechCorp", atsScore: 82, template: "Modern", updatedAt: "2 hours ago" },
  { id: "2", name: "Alex Johnson", targetJob: "Full Stack Developer @ StartupXYZ", atsScore: 67, template: "Classic", updatedAt: "Yesterday" },
  { id: "3", name: "Alex Johnson", targetJob: "Lead Engineer @ BigCo", atsScore: 54, template: "Creative", updatedAt: "3 days ago" },
];

export default function DashboardPage() {
  const [resumes] = useState<SavedResume[]>(DEMO_RESUMES);
  const [isPro] = useState(false);

  const scoreColor = (s: number) => s >= 75 ? "#5dca9e" : s >= 50 ? "#efb927" : "#e05252";

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text-primary)", marginBottom: 4 }}>
              My Resumes
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {isPro ? "Pro plan · Unlimited resumes" : `Free plan · ${resumes.length}/1 resume used`}
            </p>
          </div>
          <Link href="/builder" className="btn btn-primary" style={{ gap: 8 }}>
            <Plus size={14} /> New Resume
          </Link>
        </div>

        {/* Pro upsell banner */}
        {!isPro && (
          <div style={{
            background: "linear-gradient(135deg, #1c0f38, #140829)",
            border: "0.5px solid var(--accent)",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}>
            <Crown size={28} color="var(--accent)" />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Unlock CareerForge Pro</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Get unlimited resumes, AI rewriting, cover letters & premium templates.
              </p>
            </div>
            <Link href="/pricing" className="btn btn-primary" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
              <Zap size={13} /> Upgrade · $19/mo
            </Link>
          </div>
        )}

        {/* Resume cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {resumes.map((r) => (
            <div key={r.id} className="card" style={{
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "border-color 0.2s",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7F77DD18", border: "0.5px solid var(--border-focus)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} color="var(--accent)" />
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14, marginBottom: 2 }}>{r.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.targetJob}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: scoreColor(r.atsScore), lineHeight: 1 }}>
                    {r.atsScore}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>ATS Score</div>
                </div>

                <span style={{ fontSize: 11, color: "var(--text-muted)", padding: "2px 8px", background: "var(--bg-surface)", borderRadius: 99, border: "0.5px solid var(--border)" }}>
                  {r.template}
                </span>

                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.updatedAt}</span>

                <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                  <Link href="/builder" title="Edit" style={{ padding: 7, borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "0.5px solid var(--border)", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                    <Edit2 size={12} />
                  </Link>
                  <button title="Download" style={{ padding: 7, borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "0.5px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Download size={12} />
                  </button>
                  <button title="Delete" style={{ padding: 7, borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "0.5px solid #5a1f1f", color: "#e05252", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 40 }}>
          {[
            { label: "Resumes Created", value: resumes.length },
            { label: "Avg ATS Score", value: `${Math.round(resumes.reduce((a, r) => a + r.atsScore, 0) / resumes.length)}%` },
            { label: "Templates Used", value: new Set(resumes.map((r) => r.template)).size },
          ].map(({ label, value }) => (
            <div key={label} className="card" style={{ padding: "20px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text-primary)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
