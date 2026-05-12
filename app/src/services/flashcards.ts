import { apiPost, apiGet } from "./api";

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  _count?: { cards: number };
}

export interface FlashcardCard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  createdAt: string;
}

export async function createDeck(
  title: string,
  description?: string,
): Promise<FlashcardDeck> {
  const res = await apiPost<{ data: FlashcardDeck }>(
    "/api/v1/flashcards/decks",
    { title, description },
  );
  return res.data;
}

export async function listDecks(): Promise<FlashcardDeck[]> {
  const res = await apiGet<{ data: FlashcardDeck[] }>(
    "/api/v1/flashcards/decks",
  );
  return res.data;
}

export async function createCard(
  deckId: string,
  front: string,
  back: string,
  tags?: string[],
): Promise<FlashcardCard> {
  const res = await apiPost<{ data: FlashcardCard }>(
    `/api/v1/flashcards/decks/${deckId}/cards`,
    { front, back, tags },
  );
  return res.data;
}

export async function listCards(deckId: string): Promise<FlashcardCard[]> {
  const res = await apiGet<{ data: FlashcardCard[] }>(
    `/api/v1/flashcards/decks/${deckId}/cards`,
  );
  return res.data;
}
