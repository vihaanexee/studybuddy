import { prisma } from '../db/prisma.js';
import type { EmotionLabel } from '@prisma/client';

export interface EmotionSummary {
  dominantEmotion: EmotionLabel | null;
  emotionCounts: Partial<Record<EmotionLabel, number>>;
  totalSamples: number;
  frustrationLevel: 'none' | 'low' | 'medium' | 'high';
  confusionLevel: 'none' | 'low' | 'medium' | 'high';
  boredomLevel: 'none' | 'low' | 'medium' | 'high';
}

/**
 * Summarize recent emotion samples for a given user/session/thread.
 * Looks back `windowMinutes` (default 15) and returns aggregated emotion state.
 */
export async function summarizeEmotions(
  userId: string,
  sessionId?: string,
  threadId?: string,
  windowMinutes = 15,
): Promise<EmotionSummary> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);

  const where: Record<string, unknown> = {
    userId,
    timestamp: { gte: since },
  };
  if (threadId) where.threadId = threadId;
  else if (sessionId) where.sessionId = sessionId;

  const samples = await prisma.emotionSample.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 50,
    select: { label: true },
  });

  if (samples.length === 0) {
    return {
      dominantEmotion: null,
      emotionCounts: {},
      totalSamples: 0,
      frustrationLevel: 'none',
      confusionLevel: 'none',
      boredomLevel: 'none',
    };
  }

  // Count occurrences of each emotion label
  const counts: Partial<Record<EmotionLabel, number>> = {};
  for (const s of samples) {
    counts[s.label] = (counts[s.label] ?? 0) + 1;
  }

  // Find the dominant emotion
  let dominant: EmotionLabel = samples[0].label;
  let maxCount = 0;
  for (const [label, count] of Object.entries(counts)) {
    if (count! > maxCount) {
      maxCount = count!;
      dominant = label as EmotionLabel;
    }
  }

  const toLevel = (count: number, total: number): 'none' | 'low' | 'medium' | 'high' => {
    const ratio = count / total;
    if (ratio === 0) return 'none';
    if (ratio < 0.25) return 'low';
    if (ratio < 0.5) return 'medium';
    return 'high';
  };

  return {
    dominantEmotion: dominant,
    emotionCounts: counts,
    totalSamples: samples.length,
    frustrationLevel: toLevel(counts.frustrated ?? 0, samples.length),
    confusionLevel: toLevel(counts.confused ?? 0, samples.length),
    boredomLevel: toLevel(counts.bored ?? 0, samples.length),
  };
}
