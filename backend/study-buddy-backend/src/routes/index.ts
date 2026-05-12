import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware.js';
import * as authController from '../controllers/auth.js';
import { authRoutes } from './auth.js';
import { consentRoutes } from './consent.js';
import { tutorRoutes } from './tutor.js';
import { emotionsRoutes } from './emotions.js';
import { flashcardsRoutes } from './flashcards.js';
import { healthRoutes } from './health.js';

export async function registerRoutes(app: FastifyInstance) {
  // Health check at root level
  await app.register(healthRoutes);

  // API v1 routes
  await app.register(
    async (api) => {
      // Auth routes
      await api.register(authRoutes, { prefix: '/auth' });

      // GET /me (auth required)
      api.get('/me', { preHandler: [requireAuth] }, authController.getMe);

      // Consent routes
      await api.register(consentRoutes, { prefix: '/consent' });

      // Tutor + study session routes (no extra prefix — tutorRoutes handles its own paths)
      await api.register(tutorRoutes);

      // Emotion routes
      await api.register(emotionsRoutes, { prefix: '/emotions' });

      // Flashcard routes
      await api.register(flashcardsRoutes, { prefix: '/flashcards' });
    },
    { prefix: '/api/v1' },
  );
}
