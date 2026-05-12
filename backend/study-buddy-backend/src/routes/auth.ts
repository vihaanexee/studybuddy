import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware.js';
import * as authController from '../controllers/auth.js';
import { authRateLimit } from '../utils/rateLimit.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', { config: { rateLimit: authRateLimit } }, authController.register);
  app.post('/login', { config: { rateLimit: authRateLimit } }, authController.login);
  app.post('/logout', { preHandler: [requireAuth] }, authController.logout);
}
