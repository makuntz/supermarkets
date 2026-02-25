import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';
import { productRoutes } from './products';
import { authRoutes } from './auth';

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check (sem prefixo)
  await fastify.register(healthRoutes);

  const apiPrefix = fastify.config.API_PREFIX;

  // Rotas públicas (consumer - sem auth obrigatória)
  await fastify.register(productRoutes, { prefix: `${apiPrefix}/products` });

  // Rotas de autenticação
  await fastify.register(authRoutes, { prefix: `${apiPrefix}/auth` });

  // Rotas protegidas (market portal) serão adicionadas aqui
  // Exemplo futuro:
  // await fastify.register(importRoutes, {
  //   prefix: `${apiPrefix}/market/imports`,
  //   preHandler: [authMiddleware, requireMarketUser],
  // });
}

