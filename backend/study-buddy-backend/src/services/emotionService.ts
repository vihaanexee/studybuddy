import { prisma } from '../db/prisma.js';
import type { Prisma } from '@prisma/client';
import { forbidden } from '../utils/errors.js';
import type { PostEmotionSamplesInput } from '../validators/emotions.js';

/**
 * Ingest a batch of emotion samples.
 * Checks consent before storing webcam-sourced samples.
 */
export async function postEmotionSamples(userId: string, input: PostEmotionSamplesInput) {
  // Check consent settings
  const consent = await prisma.consentSettings.findUnique({
    where: { userId },
    select: { emotionTelemetryAllowed: true, webcamAllowed: true },
  });

  const hasWebcamSamples = input.samples.some((s) => s.source === 'webcam');
  if (hasWebcamSamples && !consent?.webcamAllowed) {
    throw forbidden('Webcam emotion data requires webcam consent to be enabled');
  }

  if (!consent?.emotionTelemetryAllowed) {
    throw forbidden('Emotion telemetry is not enabled. Update consent settings first.');
  }

  // Create all samples in a single transaction
  const created = await prisma.$transaction(
    input.samples.map((sample) =>
      prisma.emotionSample.create({
        data: {
          userId,
          sessionId: sample.sessionId,
          threadId: sample.threadId,
          timestamp: sample.timestamp ? new Date(sample.timestamp) : new Date(),
          source: sample.source,
          label: sample.label,
          meta: (sample.meta as Prisma.InputJsonValue) ?? undefined,
        },
        select: {
          id: true,
          label: true,
          source: true,
          timestamp: true,
        },
      }),
    ),
  );

  return { inserted: created.length, samples: created };
}
