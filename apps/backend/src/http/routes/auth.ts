// Auth routes
// Placeholder routes para autenticação (login, refresh, me)

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authMiddleware, requireAuth } from '../../auth';
import { hashPassword, verifyPassword } from '../../auth/hash';
import { generateAccessToken, generateRefreshToken } from '../../auth/jwt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/login
  fastify.post('/login', async (request, reply) => {
    // TODO: Implementar login real
    // 1. Validar body com loginSchema
    // 2. Buscar user por email
    // 3. Verificar senha com verifyPassword
    // 4. Buscar MarketUser se for market user
    // 5. Gerar tokens (access + refresh)
    // 6. Salvar refresh token no banco
    // 7. Retornar tokens

    return reply.status(501).send({
      error: {
        message: 'Login endpoint not implemented yet',
        code: 'NOT_IMPLEMENTED',
      },
    });
  });

  // POST /api/auth/refresh
  fastify.post('/refresh', async (request, reply) => {
    // TODO: Implementar refresh token
    // 1. Validar refresh token do body
    // 2. Verificar se token existe e não está revogado
    // 3. Gerar novo access token
    // 4. Opcionalmente gerar novo refresh token (rotation)

    return reply.status(501).send({
      error: {
        message: 'Refresh endpoint not implemented yet',
        code: 'NOT_IMPLEMENTED',
      },
    });
  });

  // GET /api/auth/me
  fastify.get(
    '/me',
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      // TODO: Implementar /me
      // 1. Buscar user completo do banco
      // 2. Buscar MarketUser se tiver marketId
      // 3. Retornar dados do usuário (sem senha)

      if (!requireAuth(request, reply)) {
        return;
      }

      return reply.status(501).send({
        error: {
          message: '/me endpoint not implemented yet',
          code: 'NOT_IMPLEMENTED',
        },
      });
    }
  );
}

