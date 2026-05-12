"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import {
  Sparkles,
  Brain,
  Heart,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  MessageCircle,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Tutoring",
    description:
      "Get personalized explanations from an AI tutor that adapts its teaching style in real-time.",
    color: "#7c5cfc",
  },
  {
    icon: Heart,
    title: "Emotion-Aware",
    description:
      "The tutor detects when you're frustrated or confused and adjusts its approach automatically.",
    color: "#f87171",
  },
  {
    icon: MessageCircle,
    title: "Interactive Chat",
    description:
      "Engage in natural conversations with streaming responses for a seamless learning experience.",
    color: "#34d399",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description:
      "Track your emotional patterns and study habits to optimize your learning sessions.",
    color: "#60a5fa",
  },
  {
    icon: Zap,
    title: "Flashcard Generation",
    description:
      "Create flashcard decks to reinforce what you've learned during your study sessions.",
    color: "#fbbf24",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Full consent controls over your emotion data. You decide what gets stored and for how long.",
    color: "#a78bfa",
  },
];

export default function LandingPage() {
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div
            className="badge badge-accent"
            style={{
              marginBottom: 24,
              display: "inline-flex",
              gap: 6,
            }}
          >
            <Sparkles size={14} />
            Emotion-Aware AI Tutoring
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Learn smarter with an{" "}
            <span
              style={{
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI tutor
            </span>{" "}
            that understands you
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              maxWidth: 540,
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            Study Buddy adapts to your emotional state — when you&apos;re
            frustrated it simplifies, when you&apos;re bored it challenges. Real
            learning, real care.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="btn btn-primary btn-lg"
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link href="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card"
                style={{ padding: 28 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: `${feature.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={22} color={feature.color} />
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: "var(--text-primary)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "24px",
          textAlign: "center",
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        © {new Date().getFullYear()} Study Buddy. Built with care.
      </footer>
    </div>
  );
}
