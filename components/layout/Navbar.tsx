"use client";

import { Zap, LayoutDashboard, CreditCard, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/builder", label: "Builder", icon: FileText },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(6,2,15,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "0.5px solid var(--border-bright)",
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--purple-700), var(--accent))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Zap size={16} color="#EEEDFE" fill="#EEEDFE" />
          </div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            color: "var(--text-primary)",
            letterSpacing: "-0.3px",
          }}>
            CareerForge <span style={{ color: "var(--accent)" }}>Pro</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--accent-bright)" : "var(--text-secondary)",
                  background: active ? "#7F77DD14" : "transparent",
                  border: active ? "0.5px solid var(--border-focus)" : "0.5px solid transparent",
                  transition: "all 0.15s",
                  textDecoration: "none",
                }}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/pricing" className="btn btn-primary" style={{ fontSize: 13, padding: "7px 16px" }}>
          <Zap size={13} />
          Upgrade to Pro
        </Link>
      </div>
    </nav>
  );
}
