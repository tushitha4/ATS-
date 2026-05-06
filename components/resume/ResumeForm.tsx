"use client";

import { useState } from "react";
import { Plus, Trash2, Wand2, Loader2, RotateCcw, Check } from "lucide-react";
import type { ResumeData, ExperienceItem, EducationItem, BulletPoint } from "@/lib/types";

interface ResumeFormProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  targetKeywords: string[];
  jobTitle: string;
}

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export default function ResumeForm({ resume, onChange, targetKeywords, jobTitle }: ResumeFormProps) {
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [rewritingAll, setRewritingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "experience" | "education" | "skills">("contact");

  const update = (partial: Partial<ResumeData>) => onChange({ ...resume, ...partial });

  const rewriteBullet = async (expId: string, bulletId: string, original: string) => {
    if (!targetKeywords.length) {
      alert("Please analyze a job description first to get target keywords.");
      return;
    }
    setRewritingId(bulletId);
    try {
      const res = await fetch("/api/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: original, targetKeywords, jobTitle }),
      });
      const json = await res.json();
      if (json.data?.rewritten) {
        const updated = resume.experience.map((exp) => {
          if (exp.id !== expId) return exp;
          return {
            ...exp,
            bullets: exp.bullets.map((b) => {
              if (b.id !== bulletId) return b;
              return { ...b, rewritten: json.data.rewritten, useRewritten: true };
            }),
          };
        });
        update({ experience: updated });
      }
    } catch (e) {
      console.error(e);
    }
    setRewritingId(null);
  };

  const rewriteAll = async () => {
    if (!targetKeywords.length) {
      alert("Please analyze a job description first.");
      return;
    }
    setRewritingAll(true);
    try {
      const res = await fetch("/api/rewrite-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, targetKeywords, jobTitle }),
      });
      const json = await res.json();
      if (json.data) onChange(json.data);
    } catch (e) {
      console.error(e);
    }
    setRewritingAll(false);
  };

  const tabs = ["contact", "experience", "education", "skills"] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: "0.5px solid var(--border)",
        marginBottom: 20,
        gap: 2,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "1.5px solid var(--accent)" : "1.5px solid transparent",
              color: activeTab === tab ? "var(--accent-bright)" : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingBottom: 6 }}>
          <button
            className="btn btn-primary"
            onClick={rewriteAll}
            disabled={rewritingAll || !targetKeywords.length}
            style={{ fontSize: 12, padding: "5px 12px", opacity: !targetKeywords.length ? 0.4 : 1 }}
          >
            {rewritingAll ? <Loader2 size={12} className="spin" /> : <Wand2 size={12} />}
            AI Rewrite All
          </button>
        </div>
      </div>

      {/* Contact */}
      {activeTab === "contact" && (
        <div className="fade-in-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Full Name", "name", resume.contact.name],
            ["Email", "email", resume.contact.email],
            ["Phone", "phone", resume.contact.phone],
            ["Location", "location", resume.contact.location],
            ["LinkedIn", "linkedin", resume.contact.linkedin ?? ""],
            ["Website", "website", resume.contact.website ?? ""],
          ].map(([label, field, value]) => (
            <div key={field}>
              <label className="label">{label}</label>
              <input
                className="input"
                value={value}
                onChange={(e) => update({ contact: { ...resume.contact, [field]: e.target.value } })}
              />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Professional Summary</label>
            <textarea
              className="input"
              value={resume.summary}
              onChange={(e) => update({ summary: e.target.value })}
              style={{ minHeight: 90 }}
            />
          </div>
        </div>
      )}

      {/* Experience */}
      {activeTab === "experience" && (
        <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {resume.experience.map((exp) => (
            <ExperienceEditor
              key={exp.id}
              exp={exp}
              rewritingId={rewritingId}
              onRewriteBullet={(bulletId, original) => rewriteBullet(exp.id, bulletId, original)}
              onChange={(updated) => {
                update({ experience: resume.experience.map((e) => (e.id === exp.id ? updated : e)) });
              }}
              onDelete={() => update({ experience: resume.experience.filter((e) => e.id !== exp.id) })}
            />
          ))}
          <button
            className="btn btn-ghost bounce"
            onClick={() => update({
              experience: [...resume.experience, {
                id: uid(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [],
              }],
            })}
            style={{ alignSelf: "flex-start", fontSize: 13 }}
          >
            <Plus size={13} /> Add Experience
          </button>
        </div>
      )}

      {/* Education */}
      {activeTab === "education" && (
        <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {resume.education.map((edu, index) => (
            <div key={edu.id} className="card slide-in-left" style={{ padding: 16, position: "relative", animationDelay: `${index * 0.1}s` }}>
              <button
                onClick={() => update({ education: resume.education.filter((e) => e.id !== edu.id) })}
                style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <Trash2 size={13} />
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {([
                  ["Institution", "institution", edu.institution],
                  ["Degree", "degree", edu.degree],
                  ["Field of Study", "field", edu.field],
                  ["Graduation Date", "graduationDate", edu.graduationDate],
                  ["GPA", "gpa", edu.gpa ?? ""],
                ] as [string, keyof EducationItem, string][]).map(([label, field, value]) => (
                  <div key={field}>
                    <label className="label">{label}</label>
                    <input
                      className="input"
                      value={value}
                      onChange={(e) => update({
                        education: resume.education.map((ed) =>
                          ed.id === edu.id ? { ...ed, [field]: e.target.value } : ed
                        ),
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            className="btn btn-ghost"
            onClick={() => update({
              education: [...resume.education, { id: uid(), institution: "", degree: "", field: "", graduationDate: "", gpa: "" }],
            })}
            style={{ alignSelf: "flex-start", fontSize: 13 }}
          >
            <Plus size={13} /> Add Education
          </button>
        </div>
      )}

      {/* Skills */}
      {activeTab === "skills" && (
        <div className="fade-in-up">
          <label className="label">Skills (comma-separated)</label>
          <textarea
            className="input"
            value={resume.skills.join(", ")}
            onChange={(e) => update({ skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            style={{ minHeight: 100 }}
            placeholder="React, TypeScript, Node.js, AWS, Docker…"
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="badge badge-purple"
                style={{ cursor: "pointer" }}
                onClick={() => update({ skills: resume.skills.filter((s) => s !== skill) })}
                title="Click to remove"
              >
                {skill} ×
              </span>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label className="label">Template</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["classic", "modern", "creative"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ template: t })}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-md)",
                    border: resume.template === t ? "1px solid var(--accent)" : "0.5px solid var(--border-bright)",
                    background: resume.template === t ? "#7F77DD14" : "transparent",
                    color: resume.template === t ? "var(--accent-bright)" : "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {resume.template === t && <Check size={11} />}
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Experience Editor Sub-component ────────────────────────────

function ExperienceEditor({
  exp, rewritingId, onRewriteBullet, onChange, onDelete,
}: {
  exp: ExperienceItem;
  rewritingId: string | null;
  onRewriteBullet: (bulletId: string, original: string) => void;
  onChange: (updated: ExperienceItem) => void;
  onDelete: () => void;
}) {
  const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const updateBullet = (id: string, partial: Partial<BulletPoint>) => {
    onChange({ ...exp, bullets: exp.bullets.map((b) => (b.id === id ? { ...b, ...partial } : b)) });
  };

  return (
    <div className="card slide-in-right" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
          {exp.title || "New Position"} {exp.company ? `@ ${exp.company}` : ""}
        </span>
        <button
          onClick={onDelete}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {([["Job Title", "title", exp.title], ["Company", "company", exp.company],
           ["Start Date", "startDate", exp.startDate], ["End Date", "endDate", exp.current ? "Present" : exp.endDate],
        ] as [string, keyof ExperienceItem, string][]).map(([label, field, value]) => (
          <div key={field}>
            <label className="label">{label}</label>
            <input
              className="input"
              value={value}
              onChange={(e) => onChange({ ...exp, [field]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <label className="label">Bullet Points</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {exp.bullets.map((bullet) => (
          <div key={bullet.id} style={{
            background: "var(--bg-surface)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: 12,
          }}>
            <div style={{ display: "flex", gap: 8, marginBottom: bullet.rewritten ? 8 : 0 }}>
              <textarea
                className="input"
                value={bullet.original}
                onChange={(e) => updateBullet(bullet.id, { original: e.target.value })}
                style={{ minHeight: 60, fontSize: 13, flex: 1 }}
                placeholder="Describe your achievement…"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button
                  className="btn btn-outline"
                  style={{ padding: "6px 10px", fontSize: 11 }}
                  onClick={() => onRewriteBullet(bullet.id, bullet.original)}
                  disabled={rewritingId === bullet.id}
                  title="AI Rewrite"
                >
                  {rewritingId === bullet.id ? <Loader2 size={11} className="spin" /> : <Wand2 size={11} />}
                </button>
                <button
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "6px 10px" }}
                  onClick={() => onChange({ ...exp, bullets: exp.bullets.filter((b) => b.id !== bullet.id) })}
                  title="Remove bullet"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            {bullet.rewritten && (
              <div style={{
                background: "#0f2218",
                border: "0.5px solid #2a5a3a",
                borderRadius: "var(--radius-sm)",
                padding: "8px 10px",
                fontSize: 12,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#5dca9e", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    ✦ AI Rewritten
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      style={{ background: "none", border: "none", fontSize: 10, color: "#5dca9e", cursor: "pointer" }}
                      onClick={() => updateBullet(bullet.id, { useRewritten: !bullet.useRewritten })}
                    >
                      {bullet.useRewritten ? "✓ Using" : "Use this"}
                    </button>
                    <button
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                      onClick={() => updateBullet(bullet.id, { rewritten: undefined, useRewritten: false })}
                      title="Discard"
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                </div>
                <p style={{ color: "#a8d9c0", lineHeight: 1.5, margin: 0 }}>{bullet.rewritten}</p>
              </div>
            )}
          </div>
        ))}
        <button
          className="btn btn-ghost"
          onClick={() => onChange({ ...exp, bullets: [...exp.bullets, { id: uid(), original: "", useRewritten: false }] })}
          style={{ alignSelf: "flex-start", fontSize: 12 }}
        >
          <Plus size={12} /> Add Bullet
        </button>
      </div>
    </div>
  );
}
