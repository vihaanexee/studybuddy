import type { FastifyRequest, FastifyReply } from 'fastify';
import { getSessionToken, validateSession } from './session.js';
import { unauthorized } from '../utils/errors.js';

// Extend Fastify request type to include userId
declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

export async function requireAuth(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const token = getSessionToken(request.cookies as Record<string, string | undefined>);
  if (!token) {
    throw unauthorized('No session cookie provided');
  }

  const userId = await validateSession(token);
  if (!userId) {
    throw unauthorized('Invalid or expired session');
  }

  request.userId = userId;
}
