import Link from "next/link";
import { Zap, FileText, Target, Download, Check } from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: Target, title: "JD Analysis Agent", desc: "Extracts and ranks ATS keywords from any job description — hard skills, tools, qualifications." },
    { icon: Zap, title: "AI Bullet Rewriter", desc: "GPT-4o-mini rewrites your experience bullets to naturally include target keywords." },
    { icon: FileText, title: "3 Premium Templates", desc: "Classic, Modern, and Creative layouts — all ATS-readable and professionally formatted." },
    { icon: Download, title: "Pixel-perfect PDF", desc: "Puppeteer renders your resume to a crisp, page-bounded, downloadable PDF." },
  ];

  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Get started",
      features: ["1 resume per month", "Basic templates", "JD keyword preview", "PDF export"],
      cta: "Get Started",
      href: "/builder",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mo",
      desc: "For serious job seekers",
      features: ["Unlimited resumes", "AI bullet rewriting", "ATS score optimizer", "Premium templates", "Cover letter generator", "Resume dashboard"],
      cta: "Start Pro",
      href: "/pricing",
      highlight: true,
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "0.5px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--purple-700), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color="#EEEDFE" fill="#EEEDFE" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)" }}>
            CareerForge <span style={{ color: "var(--accent)" }}>Pro</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/builder" className="btn btn-ghost" style={{ fontSize: 13 }}>Builder</Link>
          <Link href="/pricing" className="btn btn-ghost" style={{ fontSize: 13 }}>Pricing</Link>
          <Link href="/builder" className="btn btn-primary" style={{ fontSize: 13 }}>
            <Zap size={13} /> Try Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "100px 48px 80px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, #7F77DD18 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="badge badge-purple" style={{ marginBottom: 20 }}>
          <Zap size={10} /> AI-Powered ATS Optimizer
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 6vw, 72px)",
          lineHeight: 1.1,
          color: "var(--text-primary)",
          marginBottom: 20,
          maxWidth: 800,
          margin: "0 auto 20px",
        }}>
          Beat ATS Systems.<br />
          <span style={{ color: "var(--accent)" }}>Land More Interviews.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Paste a job description, let AI rewrite your resume bullets to match, and download a perfectly formatted PDF — in minutes.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/builder" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
            <Zap size={16} /> Build My Resume
          </Link>
          <Link href="/pricing" className="btn btn-outline" style={{ fontSize: 15, padding: "12px 28px" }}>
            View Pricing
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Everything you need</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--text-primary)" }}>Built to get you hired</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7F77DD18", border: "0.5px solid var(--border-focus)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={18} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "60px 48px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--text-primary)" }}>Simple Pricing</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {tiers.map((tier) => (
            <div key={tier.name} className="card" style={{ padding: 28, border: tier.highlight ? "1px solid var(--accent)" : undefined, position: "relative" }}>
              {tier.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#06020f", fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 99 }}>
                  POPULAR
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 6px" }}>{tier.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--text-primary)" }}>{tier.price}</span>
                  {tier.period && <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{tier.period}</span>}
                </div>
              </div>
              <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                    <Check size={13} color="var(--accent)" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={tier.href} className={`btn ${tier.highlight ? "btn-primary" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "32px 48px", borderTop: "0.5px solid var(--border)", color: "var(--text-muted)", fontSize: 12 }}>
        © 2025 CareerForge Pro · Zaalima Development Pvt. Ltd.
      </footer>
    </main>
  );
}
