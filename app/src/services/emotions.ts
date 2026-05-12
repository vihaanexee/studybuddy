import { apiPost } from "./api";

export type EmotionLabel =
  | "happy"
  | "sad"
  | "frustrated"
  | "confused"
  | "bored"
  | "neutral";

export type EmotionSource = "self_report" | "webcam";

export interface EmotionSample {
  sessionId?: string;
  threadId?: string;
  timestamp?: string;
  source: EmotionSource;
  label: EmotionLabel;
  meta?: Record<string, unknown>;
}

interface EmotionResponse {
  data: {
    inserted: number;
    samples: Array<{
      id: string;
      label: string;
      source: string;
      timestamp: string;
    }>;
  };
}

export async function postEmotionSamples(
  samples: EmotionSample[],
): Promise<EmotionResponse["data"]> {
  const res = await apiPost<EmotionResponse>("/api/v1/emotions/samples", {
    samples,
  });
  return res.data;
}

/** Convenience: post a single self-report emotion */
export async function reportEmotion(
  label: EmotionLabel,
  sessionId?: string,
  threadId?: string,
): Promise<EmotionResponse["data"]> {
  return postEmotionSamples([
    {
      source: "self_report",
      label,
      sessionId,
      threadId,
    },
  ]);
}
