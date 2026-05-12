"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
  BookOpen,
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/study", label: "Study", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  // Don't show navbar on landing page or login page
  if (!user || pathname === "/" || pathname === "/login") return null;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-primary)",
          }}
        >
          <Sparkles size={22} color="var(--accent-primary)" />
          Study Buddy
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="btn-ghost"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                  background: isActive
                    ? "var(--accent-glow)"
                    : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            {user.profile?.displayName ?? user.email}
          </span>
          <button
            onClick={logout}
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
