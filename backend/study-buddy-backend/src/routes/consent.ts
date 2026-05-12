import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware.js';
import * as consentController from '../controllers/consent.js';

export async function consentRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/', consentController.getConsent);
  app.put('/', consentController.updateConsent);
}
