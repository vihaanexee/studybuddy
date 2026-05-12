import { prisma } from '../db/prisma.js';
import { notFound, forbidden } from '../utils/errors.js';
import type { CreateDeckInput, CreateCardInput } from '../validators/flashcards.js';

export async function createDeck(userId: string, input: CreateDeckInput) {
  return prisma.flashcardDeck.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
  });
}

export async function listDecks(userId: string) {
  return prisma.flashcardDeck.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      _count: { select: { cards: true } },
    },
  });
}

export async function createCard(deckId: string, userId: string, input: CreateCardInput) {
  // Verify deck ownership
  const deck = await prisma.flashcardDeck.findUnique({
    where: { id: deckId },
    select: { userId: true },
  });
  if (!deck) throw notFound('Deck not found');
  if (deck.userId !== userId) throw forbidden('Not your deck');

  return prisma.flashcardCard.create({
    data: {
      deckId,
      front: input.front,
      back: input.back,
      tags: input.tags ?? [],
    },
    select: {
      id: true,
      front: true,
      back: true,
      tags: true,
      createdAt: true,
    },
  });
}

export async function listCards(deckId: string, userId: string) {
  // Verify deck ownership
  const deck = await prisma.flashcardDeck.findUnique({
    where: { id: deckId },
    select: { userId: true },
  });
  if (!deck) throw notFound('Deck not found');
  if (deck.userId !== userId) throw forbidden('Not your deck');

  return prisma.flashcardCard.findMany({
    where: { deckId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      front: true,
      back: true,
      tags: true,
      createdAt: true,
    },
  });
}
