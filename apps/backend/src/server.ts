import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env';
import { prismaPlugin } from './plugins/prisma';
import { registerRoutes } from './http/routes';

const server = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

// Decorar server com config
declare module 'fastify' {
  interface FastifyInstance {
    config: typeof env;
  }
}

server.decorate('config', env);

// Plugins
server.register(cors, {
  origin: true, // Em produção, configurar origins específicos
});

server.register(prismaPlugin);

// Routes
server.register(registerRoutes);

// Error handler global
server.setErrorHandler((error, _request, reply) => {
  server.log.error(error);

  reply.status(error.statusCode || 500).send({
    error: {
      message: error.message || 'Internal Server Error',
      ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    server.log.info(`🚀 Server listening on http://0.0.0.0:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const shutdown = async () => {
  server.log.info('Shutting down gracefully...');
  await server.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

