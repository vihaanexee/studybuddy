import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from './logger.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFound(message = 'Not found'): AppError {
  return new AppError(404, message, 'NOT_FOUND');
}

export function unauthorized(message = 'Unauthorized'): AppError {
  return new AppError(401, message, 'UNAUTHORIZED');
}

export function forbidden(message = 'Forbidden'): AppError {
  return new AppError(403, message, 'FORBIDDEN');
}

export function badRequest(message = 'Bad request'): AppError {
  return new AppError(400, message, 'BAD_REQUEST');
}

export function conflict(message = 'Conflict'): AppError {
  return new AppError(409, message, 'CONFLICT');
}

export function tooManyRequests(message = 'Too many requests'): AppError {
  return new AppError(429, message, 'TOO_MANY_REQUESTS');
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const requestId = request.id;

  if (error instanceof AppError) {
    logger.warn({ requestId, code: error.code, msg: error.message });
    reply.status(error.statusCode).send({
      error: error.code ?? 'APP_ERROR',
      message: error.message,
      requestId,
    });
    return;
  }

  // Zod validation errors
  if (error.name === 'ZodError') {
    reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: (error as any).issues,
      requestId,
    });
    return;
  }

  // Fastify rate limit
  if (error.statusCode === 429) {
    reply.status(429).send({
      error: 'TOO_MANY_REQUESTS',
      message: error.message,
      requestId,
    });
    return;
  }

  // Unexpected errors
  logger.error({ requestId, err: error }, 'Unhandled error');
  reply.status(500).send({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    requestId,
  });
}
