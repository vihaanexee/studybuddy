"use client";

import { useEffect, useState, useCallback } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import {
  getConsent,
  updateConsent,
  type ConsentSettings,
} from "@/services/consent";
import { Settings, Shield, Eye, Database, Save, Check } from "lucide-react";

function SettingsContent() {
  const [consent, setConsent] = useState<ConsentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [retentionInput, setRetentionInput] = useState("");

  useEffect(() => {
    getConsent()
      .then((c) => {
        setConsent(c);
        setRetentionInput(String(c.retentionDays));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = useCallback(
    async (
      field: "emotionTelemetryAllowed" | "webcamAllowed",
    ) => {
      if (!consent) return;
      setSaving(true);
      try {
        const updated = await updateConsent({
          [field]: !consent[field],
        });
        setConsent(updated);
        flashSaved();
      } finally {
        setSaving(false);
      }
    },
    [consent],
  );

  const handleRetentionSave = useCallback(async () => {
    const days = parseInt(retentionInput, 10);
    if (isNaN(days) || days < 1 || days > 365) return;
    setSaving(true);
    try {
      const updated = await updateConsent({ retentionDays: days });
      setConsent(updated);
      flashSaved();
    } finally {
      setSaving(false);
    }
  }, [retentionInput]);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40vh",
            color: "var(--text-muted)",
          }}
        >
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Privacy controls and consent preferences
        </p>
      </div>

      {/* Saved indicator */}
      {saved && (
        <div
          className="animate-fade-in"
          style={{
            position: "fixed",
            top: 80,
            right: 24,
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(52, 211, 153, 0.15)",
            border: "1px solid rgba(52, 211, 153, 0.3)",
            color: "var(--success)",
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 100,
          }}
        >
          <Check size={14} />
          Settings saved
        </div>
      )}

      {/* Privacy & Consent */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Shield size={20} color="var(--accent-primary)" />
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Privacy & Consent
          </h2>
        </div>

        {/* Emotion Telemetry */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "rgba(124, 92, 252, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Settings size={18} color="var(--accent-primary)" />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                Emotion Telemetry
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                Allow the app to store emotion reports to improve tutoring
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={consent?.emotionTelemetryAllowed ?? false}
              onChange={() => handleToggle("emotionTelemetryAllowed")}
              disabled={saving}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Webcam */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "rgba(96, 165, 250, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Eye size={18} color="#60a5fa" />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                Webcam Emotion Detection
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                Allow webcam-based emotion detection during study sessions
              </p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={consent?.webcamAllowed ?? false}
              onChange={() => handleToggle("webcamAllowed")}
              disabled={saving}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Retention */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "rgba(251, 191, 36, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Database size={18} color="#fbbf24" />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                Data Retention
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                How long to keep emotion data (1-365 days)
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              value={retentionInput}
              onChange={(e) => setRetentionInput(e.target.value)}
              min={1}
              max={365}
              className="input"
              style={{ width: 80, textAlign: "center" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              days
            </span>
            <button
              onClick={handleRetentionSave}
              disabled={saving}
              className="btn btn-secondary btn-sm"
            >
              <Save size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "var(--radius-md)",
          background: "rgba(96, 165, 250, 0.06)",
          border: "1px solid rgba(96, 165, 250, 0.12)",
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--info)" }}>ℹ️ Privacy Note:</strong>{" "}
        Your emotion data is only used to improve your tutoring experience.
        It is never shared with third parties. You can disable telemetry at
        any time and request data deletion.
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
