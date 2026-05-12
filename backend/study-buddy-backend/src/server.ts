import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { env } from './config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './utils/errors.js';
import { registerRoutes } from './routes/index.js';
import { prisma } from './db/prisma.js';

async function main() {
  const app = Fastify({
    logger: false, // We use our own pino logger
    genReqId: () => crypto.randomUUID(),
    trustProxy: true,
  });

  // ─── Plugins ────────────────────────────────────────────

  // CORS — allow frontend origin with credentials
  await app.register(cors, {
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookies
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  // Rate limiting (global defaults, overridden per-route)
  await app.register(rateLimit, {
    global: false, // Only applied where explicitly configured
    max: 100,
    timeWindow: '1 minute',
  });

  // ─── Request Logging ───────────────────────────────────

  app.addHook('onRequest', (request, _reply, done) => {
    logger.info(
      { requestId: request.id, method: request.method, url: request.url },
      'Incoming request',
    );
    done();
  });

  app.addHook('onResponse', (request, reply, done) => {
    logger.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      },
      'Request completed',
    );
    done();
  });

  // ─── Error Handler ─────────────────────────────────────

  app.setErrorHandler(errorHandler);

  // ─── Routes ─────────────────────────────────────────────

  await registerRoutes(app);

  // ─── Graceful Shutdown ──────────────────────────────────

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // ─── Start ──────────────────────────────────────────────

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`🚀 Study Buddy backend running on http://localhost:${env.PORT}`);
    logger.info(`📚 Environment: ${env.NODE_ENV}`);
    logger.info(`🌐 CORS origin: ${env.FRONTEND_ORIGIN}`);
  } catch (err) {
    logger.fatal(err, 'Failed to start server');
    process.exit(1);
  }
}

main();
