import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware.js';
import * as emotionsController from '../controllers/emotions.js';

export async function emotionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.post('/samples', emotionsController.postEmotionSamples);
}
