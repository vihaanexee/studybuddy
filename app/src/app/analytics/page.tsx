"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { EmotionPicker } from "@/components/EmotionPicker";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Brain,
  Heart,
} from "lucide-react";

function AnalyticsContent() {
  // NOTE: In a full implementation, you'd fetch real emotion data from the backend.
  // For now, we show the UI structure with placeholder data.
  const emotionData = [
    { label: "Happy", count: 12, color: "#34d399", pct: 30 },
    { label: "Neutral", count: 10, color: "#9898a8", pct: 25 },
    { label: "Confused", count: 8, color: "#fbbf24", pct: 20 },
    { label: "Frustrated", count: 5, color: "#f87171", pct: 12 },
    { label: "Sad", count: 3, color: "#60a5fa", pct: 8 },
    { label: "Bored", count: 2, color: "#a78bfa", pct: 5 },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">
          Track your emotional patterns and study habits
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            icon: Clock,
            label: "Study Sessions",
            value: "—",
            color: "#7c5cfc",
          },
          {
            icon: Brain,
            label: "Total Messages",
            value: "—",
            color: "#60a5fa",
          },
          {
            icon: Heart,
            label: "Emotion Reports",
            value: "—",
            color: "#f87171",
          },
          {
            icon: TrendingUp,
            label: "Dominant Mood",
            value: "—",
            color: "#34d399",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card"
              style={{ padding: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-md)",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color={stat.color} />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Emotion Distribution */}
      <div
        className="glass-card"
        style={{ padding: 28, marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <BarChart3 size={20} color="var(--accent-primary)" />
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Emotion Distribution
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {emotionData.map((e) => (
            <div key={e.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text-primary)" }}>
                  {e.label}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  {e.pct}%
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${e.pct}%`,
                    background: e.color,
                    borderRadius: "var(--radius-full)",
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 20,
            fontStyle: "italic",
          }}
        >
          Analytics data will populate as you use the app and report your emotions.
        </p>
      </div>

      {/* Quick Report */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          How are you feeling right now?
        </h2>
        <EmotionPicker />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsContent />
    </AuthGuard>
  );
}
