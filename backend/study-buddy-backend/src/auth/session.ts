import { nanoid } from 'nanoid';
import type { FastifyReply } from 'fastify';
import { prisma } from '../db/prisma.js';
import { env, isProd } from '../config.js';

const SESSION_TOKEN_LENGTH = 48;
const COOKIE_NAME = 'session';

export async function createSession(userId: string, reply: FastifyReply): Promise<string> {
  const token = nanoid(SESSION_TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000);

  await prisma.session.create({
    data: { id: token, userId, expiresAt },
  });

  reply.setCookie(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    expires: expiresAt,
  });

  return token;
}

export async function validateSession(token: string): Promise<string | null> {
  const session = await prisma.session.findUnique({ where: { id: token } });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: token } }).catch(() => {});
    return null;
  }

  return session.userId;
}

export async function deleteSession(token: string, reply: FastifyReply): Promise<void> {
  await prisma.session.delete({ where: { id: token } }).catch(() => {});
  reply.clearCookie(COOKIE_NAME, { path: '/' });
}

export function getSessionToken(cookies: Record<string, string | undefined>): string | undefined {
  return cookies[COOKIE_NAME];
}
