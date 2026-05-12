import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware.js';
import * as tutorController from '../controllers/tutor.js';
import { tutorStreamRateLimit } from '../utils/rateLimit.js';

export async function tutorRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  // Study sessions
  app.post('/study-sessions', tutorController.createStudySession);

  // Threads
  app.post('/tutor/threads', tutorController.createThread);
  app.get('/tutor/threads', tutorController.listThreads);
  app.get('/tutor/threads/:id/messages', tutorController.getThreadMessages);
  app.post('/tutor/threads/:id/messages', tutorController.postMessage);

  // SSE streaming
  app.get(
    '/tutor/threads/:id/stream',
    { config: { rateLimit: tutorStreamRateLimit } },
    tutorController.streamAssistant,
  );
}
