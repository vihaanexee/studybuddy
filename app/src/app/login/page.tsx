"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Sparkles, Mail, Lock, UserIcon, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { user, login, register, error, clearError, loading } = useAuthStore();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, displayName || undefined);
      }
      router.push("/dashboard");
    } catch {
      // Error is set by the store
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    clearError();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 36,
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <Sparkles size={28} color="var(--accent-primary)" />
          <span
            style={{ fontSize: 22, fontWeight: 700 }}
          >
            Study Buddy
          </span>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-secondary)",
            padding: 4,
            marginBottom: 28,
          }}
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                clearError();
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 14,
                fontWeight: mode === m ? 600 : 400,
                color:
                  mode === m
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                background:
                  mode === m ? "var(--bg-elevated)" : "transparent",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(248, 113, 113, 0.1)",
              border: "1px solid rgba(248, 113, 113, 0.2)",
              color: "var(--error)",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Display Name</label>
              <div style={{ position: "relative" }}>
                <UserIcon
                  size={16}
                  color="var(--text-muted)"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should I call you?"
                  className="input"
                  style={{ paddingLeft: 40 }}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Email</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                style={{ paddingLeft: 40 }}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "register"
                    ? "Min 10 chars, 1 letter, 1 number"
                    : "Enter your password"
                }
                className="input"
                style={{ paddingLeft: 40 }}
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
          >
            {submitting ? (
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 20,
          }}
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            style={{
              color: "var(--accent-primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
