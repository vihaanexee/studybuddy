import { z } from 'zod';

export const createDeckSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
});

export const createCardSchema = z.object({
  front: z.string().min(1, 'Front text is required').max(5000),
  back: z.string().min(1, 'Back text is required').max(5000),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
