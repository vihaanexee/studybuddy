import { prisma } from '../db/prisma.js';
import type { CreateStudySessionInput } from '../validators/tutor.js';

export async function createStudySession(userId: string, input: CreateStudySessionInput) {
  return prisma.studySession.create({
    data: {
      userId,
      topic: input.topic,
    },
    select: {
      id: true,
      topic: true,
      startedAt: true,
      endedAt: true,
    },
  });
}

export async function endStudySession(sessionId: string, userId: string) {
  return prisma.studySession.updateMany({
    where: { id: sessionId, userId },
    data: { endedAt: new Date() },
  });
}
