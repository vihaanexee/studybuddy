"use client";

import { useState } from "react";
import { reportEmotion, type EmotionLabel } from "@/services/emotions";
import {
  Smile,
  Frown,
  Angry,
  HelpCircle,
  Meh,
  MinusCircle,
} from "lucide-react";

const EMOTIONS: {
  label: EmotionLabel;
  icon: React.ElementType;
  emoji: string;
  color: string;
}[] = [
  { label: "happy", icon: Smile, emoji: "😊", color: "#34d399" },
  { label: "neutral", icon: Meh, emoji: "😐", color: "#9898a8" },
  { label: "confused", icon: HelpCircle, emoji: "🤔", color: "#fbbf24" },
  { label: "frustrated", icon: Angry, emoji: "😤", color: "#f87171" },
  { label: "sad", icon: Frown, emoji: "😔", color: "#60a5fa" },
  { label: "bored", icon: MinusCircle, emoji: "😴", color: "#a78bfa" },
];

interface EmotionPickerProps {
  sessionId?: string;
  threadId?: string;
  compact?: boolean;
}

export function EmotionPicker({
  sessionId,
  threadId,
  compact = false,
}: EmotionPickerProps) {
  const [selected, setSelected] = useState<EmotionLabel | null>(null);
  const [sending, setSending] = useState(false);

  const handleSelect = async (label: EmotionLabel) => {
    if (sending) return;
    setSending(true);
    setSelected(label);
    try {
      await reportEmotion(label, sessionId, threadId);
    } catch (err) {
      console.error("Failed to report emotion:", err);
    } finally {
      setTimeout(() => {
        setSending(false);
        setSelected(null);
      }, 2000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 4 : 8,
      }}
    >
      {!compact && (
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginRight: 4,
          }}
        >
          How are you feeling?
        </span>
      )}
      {EMOTIONS.map((e) => {
        const isSelected = selected === e.label;
        return (
          <button
            key={e.label}
            onClick={() => handleSelect(e.label)}
            disabled={sending}
            title={e.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: compact ? 32 : 40,
              height: compact ? 32 : 40,
              borderRadius: "var(--radius-full)",
              border: "1px solid",
              borderColor: isSelected
                ? e.color
                : "var(--border-color)",
              background: isSelected
                ? `${e.color}20`
                : "var(--bg-elevated)",
              cursor: sending ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: sending && !isSelected ? 0.4 : 1,
              transform: isSelected ? "scale(1.15)" : "scale(1)",
              fontSize: compact ? 16 : 20,
            }}
          >
            {e.emoji}
          </button>
        );
      })}
    </div>
  );
}
