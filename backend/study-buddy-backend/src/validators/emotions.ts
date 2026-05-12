import { z } from 'zod';

export const emotionLabelEnum = z.enum([
  'happy',
  'sad',
  'frustrated',
  'confused',
  'bored',
  'neutral',
]);

export const emotionSourceEnum = z.enum(['self_report', 'webcam']);

const emotionSampleSchema = z.object({
  sessionId: z.string().uuid().optional(),
  threadId: z.string().uuid().optional(),
  timestamp: z.string().datetime().optional(),
  source: emotionSourceEnum,
  label: emotionLabelEnum,
  meta: z.record(z.unknown()).optional(),
});

export const postEmotionSamplesSchema = z.object({
  samples: z.array(emotionSampleSchema).min(1).max(50),
});

export type EmotionSampleInput = z.infer<typeof emotionSampleSchema>;
export type PostEmotionSamplesInput = z.infer<typeof postEmotionSamplesSchema>;
