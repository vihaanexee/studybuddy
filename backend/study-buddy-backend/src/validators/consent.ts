import { z } from 'zod';

export const updateConsentSchema = z.object({
  emotionTelemetryAllowed: z.boolean().optional(),
  webcamAllowed: z.boolean().optional(),
  retentionDays: z.number().int().min(1).max(365).optional(),
});

export type UpdateConsentInput = z.infer<typeof updateConsentSchema>;
