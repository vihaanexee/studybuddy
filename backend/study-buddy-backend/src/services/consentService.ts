import { prisma } from '../db/prisma.js';
import type { UpdateConsentInput } from '../validators/consent.js';

export async function getConsent(userId: string) {
  // Upsert so consent settings always exist
  return prisma.consentSettings.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: {
      emotionTelemetryAllowed: true,
      webcamAllowed: true,
      retentionDays: true,
      updatedAt: true,
    },
  });
}

export async function updateConsent(userId: string, input: UpdateConsentInput) {
  return prisma.consentSettings.upsert({
    where: { userId },
    create: {
      userId,
      ...input,
    },
    update: input,
    select: {
      emotionTelemetryAllowed: true,
      webcamAllowed: true,
      retentionDays: true,
      updatedAt: true,
    },
  });
}
