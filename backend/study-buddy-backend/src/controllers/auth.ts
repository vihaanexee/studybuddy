import type { FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from '../validators/auth.js';
import * as authService from '../services/authService.js';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const input = registerSchema.parse(request.body);
  const user = await authService.register(input, reply);
  return reply.status(201).send({ data: user });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const input = loginSchema.parse(request.body);
  const user = await authService.login(input, reply);
  return reply.status(200).send({ data: user });
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  await authService.logout(request, reply);
  return reply.status(200).send({ message: 'Logged out' });
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const user = await authService.getMe(request.userId);
  return reply.status(200).send({ data: user });
}
