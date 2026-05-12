"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuthStore } from "@/stores/authStore";
import { useStudyStore } from "@/stores/studyStore";
import {
  BookOpen,
  Clock,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function DashboardContent() {
  const { user } = useAuthStore();
  const { threads, loadThreads } = useStudyStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadThreads().then(() => setLoaded(true));
  }, [loadThreads]);

  const displayName = user?.profile?.displayName ?? user?.email ?? "Student";
  const greeting = getGreeting();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{greeting}, {displayName} 👋</h1>
        <p className="page-subtitle">
          Ready to learn something new today?
        </p>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <Link href="/study" style={{ textDecoration: "none" }}>
          <div
            className="glass-card"
            style={{
              padding: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "var(--accent-glow)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={22} color="var(--accent-primary)" />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: 2,
                }}
              >
                New Study Session
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                Start learning with your AI tutor
              </p>
            </div>
            <ArrowRight
              size={18}
              color="var(--text-muted)"
              style={{ marginLeft: "auto" }}
            />
          </div>
        </Link>

        <Link href="/analytics" style={{ textDecoration: "none" }}>
          <div
            className="glass-card"
            style={{
              padding: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "rgba(96, 165, 250, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={22} color="#60a5fa" />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: 2,
                }}
              >
                View Analytics
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                Track your learning patterns
              </p>
            </div>
            <ArrowRight
              size={18}
              color="var(--text-muted)"
              style={{ marginLeft: "auto" }}
            />
          </div>
        </Link>
      </div>

      {/* Recent Threads */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Recent Threads
          </h2>
          <Link
            href="/study"
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--accent-primary)" }}
          >
            View all
          </Link>
        </div>

        {!loaded ? (
          <div
            className="glass-card"
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Loading...
          </div>
        ) : threads.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <BookOpen
              size={40}
              strokeWidth={1.2}
              color="var(--text-muted)"
              style={{ margin: "0 auto 12px", display: "block" }}
            />
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              No study threads yet
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Start a study session to create your first thread
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {threads.slice(0, 5).map((thread) => (
              <div
                key={thread.id}
                className="glass-card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-elevated)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageSquare size={16} color="var(--accent-primary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {thread.title ?? "Untitled Thread"}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    <Clock
                      size={11}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: 4,
                      }}
                    />
                    {new Date(thread.createdAt).toLocaleDateString()}
                    {thread._count?.messages !== undefined && (
                      <span style={{ marginLeft: 12 }}>
                        {thread._count.messages} messages
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
