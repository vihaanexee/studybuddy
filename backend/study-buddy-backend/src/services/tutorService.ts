import { prisma } from '../db/prisma.js';
import { notFound, forbidden } from '../utils/errors.js';
import { getAIProvider } from '../ai/index.js';
import { summarizeEmotions } from '../ai/emotionContext.js';
import { buildSystemPrompt } from '../ai/promptBuilder.js';
import type { ChatMessage } from '../ai/provider.js';
import type { CreateThreadInput, CreateMessageInput } from '../validators/tutor.js';
import { logger } from '../utils/logger.js';

export async function createThread(userId: string, input: CreateThreadInput) {
  // Verify the session belongs to the user
  const session = await prisma.studySession.findUnique({
    where: { id: input.sessionId },
    select: { userId: true },
  });
  if (!session) throw notFound('Study session not found');
  if (session.userId !== userId) throw forbidden('Not your study session');

  return prisma.tutorThread.create({
    data: {
      userId,
      sessionId: input.sessionId,
      title: input.title,
    },
    select: {
      id: true,
      sessionId: true,
      title: true,
      createdAt: true,
    },
  });
}

export async function listThreads(userId: string) {
  return prisma.tutorThread.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      sessionId: true,
      title: true,
      createdAt: true,
      _count: { select: { messages: true } },
    },
  });
}

export async function getThreadMessages(threadId: string, userId: string) {
  const thread = await prisma.tutorThread.findUnique({
    where: { id: threadId },
    select: { userId: true },
  });
  if (!thread) throw notFound('Thread not found');
  if (thread.userId !== userId) throw forbidden('Not your thread');

  return prisma.tutorMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });
}

export async function postMessage(threadId: string, userId: string, input: CreateMessageInput) {
  const thread = await prisma.tutorThread.findUnique({
    where: { id: threadId },
    select: { userId: true },
  });
  if (!thread) throw notFound('Thread not found');
  if (thread.userId !== userId) throw forbidden('Not your thread');

  return prisma.tutorMessage.create({
    data: {
      threadId,
      role: 'user',
      content: input.content,
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });
}

/**
 * Stream the assistant's response via the AI provider.
 * Returns an async iterable of text chunks + saves the full message when done.
 */
export async function* streamAssistantResponse(
  threadId: string,
  userId: string,
  afterMessageId?: string,
): AsyncGenerator<{ type: 'token'; data: string } | { type: 'done'; data: { messageId: string } }> {
  // Load thread with session info
  const thread = await prisma.tutorThread.findUnique({
    where: { id: threadId },
    select: {
      userId: true,
      sessionId: true,
      session: { select: { topic: true } },
    },
  });
  if (!thread) throw notFound('Thread not found');
  if (thread.userId !== userId) throw forbidden('Not your thread');

  // Load messages for the thread
  const messagesWhere: Record<string, unknown> = { threadId };
  if (afterMessageId) {
    const afterMsg = await prisma.tutorMessage.findUnique({
      where: { id: afterMessageId },
      select: { createdAt: true },
    });
    if (afterMsg) {
      messagesWhere.createdAt = { gt: afterMsg.createdAt };
    }
  }

  // Get all thread messages for AI context (not just after the cursor)
  const allMessages = await prisma.tutorMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  });

  // Build emotion-aware system prompt
  const emotionSummary = await summarizeEmotions(userId, thread.sessionId, threadId);
  const systemPrompt = buildSystemPrompt(emotionSummary, thread.session?.topic ?? undefined);

  logger.debug(
    { threadId, emotionSummary: { dominant: emotionSummary.dominantEmotion, total: emotionSummary.totalSamples } },
    'Streaming with emotion context',
  );

  // Convert to ChatMessage format
  const chatMessages: ChatMessage[] = allMessages.map((m) => ({
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.content,
  }));

  // Stream from AI provider
  const provider = getAIProvider();
  let fullContent = '';

  for await (const chunk of provider.streamChat(chatMessages, systemPrompt)) {
    fullContent += chunk;
    yield { type: 'token', data: chunk };
  }

  // Save the complete assistant message
  const savedMessage = await prisma.tutorMessage.create({
    data: {
      threadId,
      role: 'assistant',
      content: fullContent,
    },
    select: { id: true },
  });

  yield { type: 'done', data: { messageId: savedMessage.id } };
}
