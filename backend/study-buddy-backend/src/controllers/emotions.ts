import type { FastifyRequest, FastifyReply } from 'fastify';
import { postEmotionSamplesSchema } from '../validators/emotions.js';
import * as emotionService from '../services/emotionService.js';

export async function postEmotionSamples(request: FastifyRequest, reply: FastifyReply) {
  const input = postEmotionSamplesSchema.parse(request.body);
  const result = await emotionService.postEmotionSamples(request.userId, input);
  return reply.status(201).send({ data: result });
}
