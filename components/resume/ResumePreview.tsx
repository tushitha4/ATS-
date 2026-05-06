"use client";

import type { ResumeData } from "@/lib/types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

interface ResumePreviewProps {
  resume: ResumeData;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  switch (resume.template) {
    case "classic": return <ClassicTemplate resume={resume} />;
    case "creative": return <CreativeTemplate resume={resume} />;
    default: return <ModernTemplate resume={resume} />;
  }
}

// ─── Shared helpers ──────────────────────────────────────────────

function getBulletText(b: { original: string; rewritten?: string; useRewritten: boolean }) {
  return b.useRewritten && b.rewritten ? b.rewritten : b.original;
}

// ─── Modern Template ─────────────────────────────────────────────

function ModernTemplate({ resume }: { resume: ResumeData }) {
  const c = resume.contact;
  return (
    <div id="resume-preview" style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      fontSize: 12,
      lineHeight: 1.5,
      color: "#1a1a2e",
      background: "#fff",
      padding: "32px 36px",
      minHeight: "100%",
    }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #7F77DD", paddingBottom: 16, marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{c.name}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 6, fontSize: 11, color: "#555" }}>
          {c.email && <span>✉ {c.email}</span>}
          {c.phone && <span>✆ {c.phone}</span>}
          {c.location && <span>⊙ {c.location}</span>}
          {c.linkedin && <span>in {c.linkedin}</span>}
        </div>
      </div>

      {resume.summary && (
        <Section title="Summary">
          <p style={{ margin: 0, color: "#333" }}>{resume.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <div>
                  <strong style={{ color: "#1a1a2e" }}>{exp.title}</strong>
                  <span style={{ color: "#555" }}> · {exp.company}</span>
                </div>
                <span style={{ fontSize: 11, color: "#777" }}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                {exp.bullets.filter((b) => getBulletText(b)).map((b) => (
                  <li key={b.id} style={{
                    marginBottom: 3,
                    color: b.useRewritten && b.rewritten ? "#1a3a2a" : "#333",
                  }}>
                    {getBulletText(b)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <strong>{edu.degree} in {edu.field}</strong>
                <div style={{ color: "#555", fontSize: 11 }}>{edu.institution}</div>
              </div>
              <span style={{ fontSize: 11, color: "#777" }}>{edu.graduationDate}</span>
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {resume.skills.map((s) => (
              <span key={s} style={{
                padding: "2px 10px",
                background: "#f0eeff",
                border: "0.5px solid #c0b8f0",
                borderRadius: 99,
                fontSize: 11,
                color: "#3c3489",
              }}>{s}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#7F77DD",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 8,
        margin: "0 0 8px",
      }}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Classic Template ────────────────────────────────────────────

function ClassicTemplate({ resume }: { resume: ResumeData }) {
  const c = resume.contact;
  return (
    <div id="resume-preview" style={{
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: 12,
      color: "#1a1a1a",
      background: "#fff",
      padding: "36px 40px",
      minHeight: "100%",
    }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #333", paddingBottom: 14, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{c.name}</h1>
        <div style={{ marginTop: 6, fontSize: 11, color: "#444", display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          {c.email && <span>{c.email}</span>}
          {c.phone && <span>{c.phone}</span>}
          {c.location && <span>{c.location}</span>}
        </div>
      </div>

      {resume.summary && <ClassicSection title="Professional Summary"><p style={{ margin: 0 }}>{resume.summary}</p></ClassicSection>}

      {resume.experience.length > 0 && (
        <ClassicSection title="Professional Experience">
          {resume.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{exp.title}, {exp.company}</strong>
                <em style={{ fontSize: 11 }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</em>
              </div>
              <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                {exp.bullets.filter((b) => getBulletText(b)).map((b) => (
                  <li key={b.id} style={{ marginBottom: 3 }}>{getBulletText(b)}</li>
                ))}
              </ul>
            </div>
          ))}
        </ClassicSection>
      )}

      {resume.education.length > 0 && (
        <ClassicSection title="Education">
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div><strong>{edu.degree} in {edu.field}</strong><br /><em>{edu.institution}</em></div>
              <span style={{ fontSize: 11 }}>{edu.graduationDate}</span>
            </div>
          ))}
        </ClassicSection>
      )}

      {resume.skills.length > 0 && (
        <ClassicSection title="Core Competencies">
          <p style={{ margin: 0 }}>{resume.skills.join(" · ")}</p>
        </ClassicSection>
      )}
    </div>
  );
}

function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "0.5px solid #999", paddingBottom: 3, marginBottom: 8 }}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Creative Template ───────────────────────────────────────────

function CreativeTemplate({ resume }: { resume: ResumeData }) {
  const c = resume.contact;
  return (
    <div id="resume-preview" style={{
      fontFamily: "'Segoe UI', sans-serif",
      fontSize: 12,
      color: "#1a1a2e",
      background: "#fff",
      minHeight: "100%",
      display: "flex",
    }}>
      {/* Sidebar */}
      <div style={{ width: 210, background: "#1a0a2e", padding: "28px 20px", flexShrink: 0 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#7F77DD", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", fontWeight: 700 }}>
          {c.name.charAt(0)}
        </div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "#EEEDFE", textAlign: "center", margin: "0 0 4px" }}>{c.name}</h1>
        <p style={{ fontSize: 10, color: "#7F77DD", textAlign: "center", margin: "0 0 20px" }}>
          {resume.experience[0]?.title ?? "Professional"}
        </p>

        <div style={{ fontSize: 10, color: "#AFA9EC", display: "flex", flexDirection: "column", gap: 6 }}>
          {c.email && <span>✉ {c.email}</span>}
          {c.phone && <span>✆ {c.phone}</span>}
          {c.location && <span>⊙ {c.location}</span>}
          {c.linkedin && <span>in {c.linkedin}</span>}
        </div>

        {resume.skills.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#7F77DD", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Skills</p>
            {resume.skills.map((s) => (
              <div key={s} style={{ fontSize: 10, color: "#CECBF6", padding: "3px 0", borderBottom: "0.5px solid #3C348940" }}>{s}</div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 24px" }}>
        {resume.summary && (
          <div style={{ marginBottom: 16, padding: 12, background: "#f8f7ff", borderLeft: "3px solid #7F77DD", borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 11, color: "#333", lineHeight: 1.6 }}>{resume.summary}</p>
          </div>
        )}

        {resume.experience.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: "#7F77DD", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#1a1a2e" }}>{exp.title}</strong>
                  <span style={{ fontSize: 10, color: "#777" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <div style={{ fontSize: 10, color: "#7F77DD", marginBottom: 4 }}>{exp.company}</div>
                <ul style={{ margin: "0 0 0 14px", padding: 0 }}>
                  {exp.bullets.filter((b) => getBulletText(b)).map((b) => (
                    <li key={b.id} style={{ marginBottom: 2, fontSize: 11 }}>{getBulletText(b)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {resume.education.length > 0 && (
          <div>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: "#7F77DD", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 11 }}>{edu.degree} in {edu.field}</strong>
                <div style={{ fontSize: 10, color: "#555" }}>{edu.institution} · {edu.graduationDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
