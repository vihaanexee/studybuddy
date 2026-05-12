import type { FastifyRequest, FastifyReply } from 'fastify';
import { updateConsentSchema } from '../validators/consent.js';
import * as consentService from '../services/consentService.js';

export async function getConsent(request: FastifyRequest, reply: FastifyReply) {
  const consent = await consentService.getConsent(request.userId);
  return reply.status(200).send({ data: consent });
}

export async function updateConsent(request: FastifyRequest, reply: FastifyReply) {
  const input = updateConsentSchema.parse(request.body);
  const consent = await consentService.updateConsent(request.userId, input);
  return reply.status(200).send({ data: consent });
}
