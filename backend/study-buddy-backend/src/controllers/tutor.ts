import type { FastifyRequest, FastifyReply } from 'fastify';
import { createStudySessionSchema, createThreadSchema, createMessageSchema, streamQuerySchema } from '../validators/tutor.js';
import * as sessionService from '../services/sessionService.js';
import * as tutorService from '../services/tutorService.js';

export async function createStudySession(request: FastifyRequest, reply: FastifyReply) {
  const input = createStudySessionSchema.parse(request.body);
  const session = await sessionService.createStudySession(request.userId, input);
  return reply.status(201).send({ data: session });
}

export async function createThread(request: FastifyRequest, reply: FastifyReply) {
  const input = createThreadSchema.parse(request.body);
  const thread = await tutorService.createThread(request.userId, input);
  return reply.status(201).send({ data: thread });
}

export async function listThreads(request: FastifyRequest, reply: FastifyReply) {
  const threads = await tutorService.listThreads(request.userId);
  return reply.status(200).send({ data: threads });
}

export async function getThreadMessages(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const messages = await tutorService.getThreadMessages(id, request.userId);
  return reply.status(200).send({ data: messages });
}

export async function postMessage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const input = createMessageSchema.parse(request.body);
  const message = await tutorService.postMessage(id, request.userId, input);
  return reply.status(201).send({ data: message });
}

export async function streamAssistant(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const query = streamQuerySchema.parse(request.query);

  // Set SSE headers — must use raw to avoid Fastify's content-length framing
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
    'Access-Control-Allow-Credentials': 'true',
  });

  // Flush headers immediately so the client can start receiving
  reply.raw.flushHeaders?.();

  // Track if client disconnected
  let clientDisconnected = false;
  request.raw.on('close', () => {
    clientDisconnected = true;
  });

  try {
    for await (const event of tutorService.streamAssistantResponse(id, request.userId, query.afterMessageId)) {
      if (clientDisconnected) break;

      if (event.type === 'token') {
        reply.raw.write(`event: token\ndata: ${JSON.stringify(event.data)}\n\n`);
      } else if (event.type === 'done') {
        reply.raw.write(`event: done\ndata: ${JSON.stringify(event.data)}\n\n`);
      }
    }
  } catch (error: any) {
    if (!clientDisconnected) {
      reply.raw.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
    }
  }

  reply.raw.end();
}
