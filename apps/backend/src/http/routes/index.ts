import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';
import { productRoutes } from './products';

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check (sem prefixo)
  await fastify.register(healthRoutes);

  // Rotas da API (com prefixo)
  const apiPrefix = fastify.config.API_PREFIX;
  await fastify.register(productRoutes, { prefix: `${apiPrefix}/products` });
}

