import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/prisma.js';
import { hashPassword, verifyPassword, validatePasswordPolicy } from '../auth/password.js';
import { createSession, deleteSession, getSessionToken } from '../auth/session.js';
import { conflict, unauthorized } from '../utils/errors.js';
import type { RegisterInput, LoginInput } from '../validators/auth.js';

export async function register(input: RegisterInput, reply: FastifyReply) {
  validatePasswordPolicy(input.password);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw conflict('Email already registered');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      profile: input.displayName
        ? { create: { displayName: input.displayName } }
        : undefined,
      consentSettings: { create: {} },
    },
    select: { id: true, email: true, createdAt: true },
  });

  await createSession(user.id, reply);
  return user;
}

export async function login(input: LoginInput, reply: FastifyReply) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw unauthorized('Invalid email or password');
  }

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    throw unauthorized('Invalid email or password');
  }

  await createSession(user.id, reply);
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const token = getSessionToken(request.cookies as Record<string, string | undefined>);
  if (token) {
    await deleteSession(token, reply);
  }
}

export async function getMe(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      profile: { select: { displayName: true } },
    },
  });
}
