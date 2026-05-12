import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware.js';
import * as flashcardsController from '../controllers/flashcards.js';

export async function flashcardsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.post('/decks', flashcardsController.createDeck);
  app.get('/decks', flashcardsController.listDecks);
  app.post('/decks/:deckId/cards', flashcardsController.createCard);
  app.get('/decks/:deckId/cards', flashcardsController.listCards);
}
