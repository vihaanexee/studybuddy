import type { FastifyRequest, FastifyReply } from 'fastify';
import { createDeckSchema, createCardSchema } from '../validators/flashcards.js';
import * as flashcardService from '../services/flashcardService.js';

export async function createDeck(request: FastifyRequest, reply: FastifyReply) {
  const input = createDeckSchema.parse(request.body);
  const deck = await flashcardService.createDeck(request.userId, input);
  return reply.status(201).send({ data: deck });
}

export async function listDecks(request: FastifyRequest, reply: FastifyReply) {
  const decks = await flashcardService.listDecks(request.userId);
  return reply.status(200).send({ data: decks });
}

export async function createCard(request: FastifyRequest, reply: FastifyReply) {
  const { deckId } = request.params as { deckId: string };
  const input = createCardSchema.parse(request.body);
  const card = await flashcardService.createCard(deckId, request.userId, input);
  return reply.status(201).send({ data: card });
}

export async function listCards(request: FastifyRequest, reply: FastifyReply) {
  const { deckId } = request.params as { deckId: string };
  const cards = await flashcardService.listCards(deckId, request.userId);
  return reply.status(200).send({ data: cards });
}
