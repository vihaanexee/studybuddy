"use client";

import { useEffect, useState, useCallback } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useStudyStore } from "@/stores/studyStore";
import { TutorChat } from "@/components/TutorChat";
import {
  Plus,
  MessageSquare,
  BookOpen,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

function StudyContent() {
  const {
    session,
    thread,
    threads,
    startSession,
    createThread,
    selectThread,
    loadThreads,
  } = useStudyStore();

  const [topic, setTopic] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [starting, setStarting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const handleStartSession = useCallback(async () => {
    setStarting(true);
    try {
      await startSession(topic || undefined);
      await createThread(topic || "New conversation");
      setTopic("");
    } finally {
      setStarting(false);
    }
  }, [topic, startSession, createThread]);

  const handleNewThread = useCallback(async () => {
    if (!session) return;
    await createThread(threadTitle || "New conversation");
    setThreadTitle("");
  }, [session, threadTitle, createThread]);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? 300 : 0,
          minWidth: sidebarOpen ? 300 : 0,
          borderRight: sidebarOpen
            ? "1px solid var(--border-color)"
            : "none",
          background: "var(--bg-secondary)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s",
          overflow: "hidden",
        }}
      >
        {/* New Session */}
        <div style={{ padding: 16, borderBottom: "1px solid var(--border-color)" }}>
          {!session ? (
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Start a Session
              </p>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What are you studying? (optional)"
                className="input"
                style={{ marginBottom: 10, fontSize: 13 }}
                onKeyDown={(e) => e.key === "Enter" && handleStartSession()}
              />
              <button
                onClick={handleStartSession}
                disabled={starting}
                className="btn btn-primary"
                style={{ width: "100%", fontSize: 13 }}
              >
                {starting ? "Starting..." : "Start Session"}
                <Sparkles size={14} />
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Active Session
                </p>
                <span className="badge badge-success" style={{ fontSize: 11 }}>
                  Live
                </span>
              </div>
              {session.topic && (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    marginBottom: 10,
                  }}
                >
                  📚 {session.topic}
                </p>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={threadTitle}
                  onChange={(e) => setThreadTitle(e.target.value)}
                  placeholder="Thread title..."
                  className="input"
                  style={{ flex: 1, fontSize: 13 }}
                  onKeyDown={(e) => e.key === "Enter" && handleNewThread()}
                />
                <button
                  onClick={handleNewThread}
                  className="btn btn-secondary"
                  style={{ padding: "8px 12px" }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Thread List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "8px 8px 4px",
            }}
          >
            Threads ({threads.length})
          </p>
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => selectThread(t)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background:
                  thread?.id === t.id
                    ? "var(--accent-glow)"
                    : "transparent",
                color:
                  thread?.id === t.id
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                transition: "all 0.15s",
                marginBottom: 2,
                fontSize: 13,
              }}
            >
              <MessageSquare size={14} />
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t.title ?? "Untitled"}
              </span>
              {t._count?.messages !== undefined && (
                <span style={{ fontSize: 11, opacity: 0.6 }}>
                  {t._count.messages}
                </span>
              )}
            </button>
          ))}
          {threads.length === 0 && (
            <div
              style={{
                padding: "24px 12px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              <BookOpen
                size={24}
                strokeWidth={1.2}
                style={{ margin: "0 auto 8px", display: "block" }}
              />
              No threads yet
            </div>
          )}
        </div>
      </div>

      {/* Toggle sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "absolute",
          left: sidebarOpen ? 290 : 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 20,
          height: 40,
          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-color)",
          borderLeft: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "left 0.3s",
          color: "var(--text-muted)",
        }}
      >
        <ChevronLeft
          size={14}
          style={{
            transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s",
          }}
        />
      </button>

      {/* Chat Area */}
      <div style={{ flex: 1, position: "relative" }}>
        <TutorChat />
      </div>
    </div>
  );
}

export default function StudyPage() {
  return (
    <AuthGuard>
      <StudyContent />
    </AuthGuard>
  );
}
