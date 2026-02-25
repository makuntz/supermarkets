// Fastify middleware para autenticação
// Extrai e valida JWT do header Authorization

import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken, JWTPayload } from './jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      error: {
        message: 'Missing or invalid authorization header',
        code: 'UNAUTHORIZED',
      },
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const payload = verifyAccessToken(token);
    request.user = payload;
  } catch (error) {
    return reply.status(401).send({
      error: {
        message: error instanceof Error ? error.message : 'Invalid token',
        code: 'UNAUTHORIZED',
      },
    });
  }
}

