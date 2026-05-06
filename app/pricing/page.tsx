"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const FREE_FEATURES = [
  "1 resume per month",
  "Basic templates (Modern only)",
  "JD keyword extraction preview",
  "ATS score calculation",
  "PDF export (browser print)",
];

const PRO_FEATURES = [
  "Unlimited resumes",
  "AI-powered bullet rewriting",
  "Full ATS score optimizer",
  "All 3 premium templates",
  "Cover letter generator",
  "Resume version dashboard",
  "High-quality Puppeteer PDF",
  "Priority support",
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user", userEmail: "demo@careerforge.pro" }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      if (json.data?.url) {
        window.location.href = json.data.url;
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Simple, Transparent
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--text-primary)", marginBottom: 16 }}>
            Choose your plan
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
            Start free. Upgrade when you need AI-powered features.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 700, margin: "0 auto" }}>
          {/* Free */}
          <div className="card" style={{ padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Free</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--text-primary)" }}>$0</span>
                <span style={{ color: "var(--text-muted)", fontSize: 14 }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Perfect for getting started</p>
            </div>
            <ul style={{ listStyle: "none", marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              {FREE_FEATURES.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <Check size={14} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <Link href="/builder" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="card" style={{
            padding: 32,
            border: "1px solid var(--accent)",
            position: "relative",
            background: "linear-gradient(160deg, #1c0f38, var(--bg-card))",
          }}>
            <div style={{
              position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
              background: "var(--accent)", color: "#06020f", fontSize: 11, fontWeight: 700,
              padding: "4px 16px", borderRadius: 99,
            }}>
              MOST POPULAR
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Pro</p>
                <Zap size={13} color="var(--accent)" fill="var(--accent)" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--text-primary)" }}>$19</span>
                <span style={{ color: "var(--text-muted)", fontSize: 14 }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>For serious job seekers</p>
            </div>

            <ul style={{ listStyle: "none", marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              {PRO_FEATURES.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <Check size={14} color="#5dca9e" style={{ marginTop: 2, flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>

            {error && (
              <div style={{ fontSize: 12, color: "#e05252", marginBottom: 12, padding: "8px 12px", background: "#1f0a0a", borderRadius: "var(--radius-md)", border: "0.5px solid #5a1f1f" }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: 15 }}
              onClick={startCheckout}
              disabled={loading}
            >
              {loading ? <Loader2 size={15} className="spin" /> : <Zap size={15} />}
              {loading ? "Redirecting…" : "Start Pro — $19/mo"}
            </button>

            <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>
              Cancel anytime · Powered by Stripe
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80, maxWidth: 600, margin: "80px auto 0" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, textAlign: "center", marginBottom: 32 }}>FAQ</h2>
          {[
            ["What does ATS optimization mean?", "ATS (Applicant Tracking System) software scans resumes for keywords before a human reads them. CareerForge Pro rewrites your resume to include the exact keywords from the job description, increasing your chances of passing the ATS filter."],
            ["How does the AI rewriting work?", "We use OpenAI's GPT-4o-mini to analyze your existing bullet points and rewrite them to naturally incorporate target keywords from the job description — without sounding robotic or keyword-stuffed."],
            ["Can I cancel anytime?", "Yes. Pro is a monthly subscription. You can cancel anytime from your dashboard and retain access until the end of your billing period."],
          ].map(([q, a]) => (
            <div key={q as string} style={{ marginBottom: 20, padding: 20, background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-md)" }}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, fontSize: 14 }}>{q}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
