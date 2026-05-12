"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useStudyStore } from "@/stores/studyStore";
import { EmotionPicker } from "./EmotionPicker";
import { Send, StopCircle, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function TutorChat() {
  const {
    thread,
    messages,
    streaming,
    streamedText,
    sendMessage,
    cancelStream,
  } = useStudyStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  // Auto-resize textarea
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    },
    [],
  );

  const handleSend = useCallback(async () => {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    await sendMessage(text);
  }, [input, streaming, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  if (!thread) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 16,
          color: "var(--text-muted)",
        }}
      >
        <Sparkles size={48} strokeWidth={1.2} />
        <p style={{ fontSize: 16 }}>
          Select or create a thread to start chatting
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg-primary)",
      }}
    >
      {/* Thread Header */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-secondary)",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {thread.title ?? "Untitled Thread"}
          </h3>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            {messages.length} messages
          </span>
        </div>
        <EmotionPicker
          sessionId={thread.sessionId}
          threadId={thread.id}
          compact
        />
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages.length === 0 && !streaming && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--text-muted)",
            }}
          >
            <Bot
              size={40}
              strokeWidth={1.2}
              style={{ margin: "0 auto 12px", display: "block" }}
            />
            <p style={{ fontSize: 15, marginBottom: 4 }}>
              Hi! I&apos;m your Study Buddy.
            </p>
            <p style={{ fontSize: 13 }}>
              Ask me anything — I&apos;ll adapt to how you&apos;re feeling.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="animate-fade-in"
            style={{
              display: "flex",
              gap: 12,
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background:
                  msg.role === "user"
                    ? "var(--accent-gradient)"
                    : "var(--bg-elevated)",
                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid var(--border-color)",
              }}
            >
              {msg.role === "user" ? (
                <User size={16} color="white" />
              ) : (
                <Bot size={16} color="var(--accent-primary)" />
              )}
            </div>

            {/* Content */}
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "var(--radius-lg)",
                background:
                  msg.role === "user"
                    ? "var(--accent-primary)"
                    : "var(--bg-card)",
                color:
                  msg.role === "user" ? "white" : "var(--text-primary)",
                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid var(--border-color)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {msg.role === "user" ? (
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streaming && (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Bot size={16} color="var(--accent-primary)" />
            </div>
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "var(--radius-lg)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {streamedText ? (
                <div className="markdown-content">
                  <ReactMarkdown>{streamedText}</ReactMarkdown>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent-primary)",
                        animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask your tutor..."
          rows={1}
          className="input"
          disabled={streaming}
          style={{
            flex: 1,
            resize: "none",
            maxHeight: 160,
            minHeight: 42,
          }}
        />
        {streaming ? (
          <button
            onClick={cancelStream}
            className="btn btn-danger"
            style={{ height: 42, width: 42, padding: 0 }}
          >
            <StopCircle size={18} />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="btn btn-primary"
            style={{ height: 42, width: 42, padding: 0 }}
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
