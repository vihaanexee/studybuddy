import { z } from 'zod';

export const createStudySessionSchema = z.object({
  topic: z.string().max(200).optional(),
});

export const createThreadSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  title: z.string().max(200).optional(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(10000),
});

export const streamQuerySchema = z.object({
  afterMessageId: z.string().uuid().optional(),
});

export type CreateStudySessionInput = z.infer<typeof createStudySessionSchema>;
export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type StreamQuery = z.infer<typeof streamQuerySchema>;
