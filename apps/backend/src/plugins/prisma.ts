import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import prisma from '../config/database';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

export async function prismaPlugin(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
}

