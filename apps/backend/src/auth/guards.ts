// RBAC Guards
// Verifica roles e permissões do usuário

import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload } from './jwt';

type UserRole = 'CONSUMER' | 'ADMIN';
type MarketUserRole = 'OPERATOR' | 'MANAGER' | 'OWNER';

/**
 * Guard: Requer autenticação (qualquer usuário autenticado)
 */
export function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): boolean {
  if (!request.user) {
    reply.status(401).send({
      error: {
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      },
    });
    return false;
  }
  return true;
}

/**
 * Guard: Requer role específica (ex: ADMIN)
 */
export function requireRole(role: UserRole) {
  return (request: FastifyRequest, reply: FastifyReply): boolean => {
    if (!requireAuth(request, reply)) {
      return false;
    }

    if (request.user!.role !== role) {
      reply.status(403).send({
        error: {
          message: `Role ${role} required`,
          code: 'FORBIDDEN',
        },
      });
      return false;
    }
    return true;
  };
}

/**
 * Guard: Requer ser market user (ter marketId)
 */
export function requireMarketUser(
  request: FastifyRequest,
  reply: FastifyReply
): boolean {
  if (!requireAuth(request, reply)) {
    return false;
  }

  if (!request.user!.marketId) {
    reply.status(403).send({
      error: {
        message: 'Market user access required',
        code: 'FORBIDDEN',
      },
    });
    return false;
  }
  return true;
}

/**
 * Guard: Requer role específica dentro do mercado
 */
export function requireMarketRole(role: MarketUserRole) {
  return (request: FastifyRequest, reply: FastifyReply): boolean => {
    if (!requireMarketUser(request, reply)) {
      return false;
    }

    const userRole = request.user!.marketRole as MarketUserRole;
    const roleHierarchy: Record<MarketUserRole, number> = {
      OPERATOR: 1,
      MANAGER: 2,
      OWNER: 3,
    };

    if (roleHierarchy[userRole] < roleHierarchy[role]) {
      reply.status(403).send({
        error: {
          message: `Market role ${role} required`,
          code: 'FORBIDDEN',
        },
      });
      return false;
    }
    return true;
  };
}

/**
 * Guard: Requer acesso ao mercado específico (multi-tenant)
 */
export function requireMarketAccess(marketIdParam: string = 'marketId') {
  return (request: FastifyRequest, reply: FastifyReply): boolean => {
    if (!requireMarketUser(request, reply)) {
      return false;
    }

    const requestedMarketId =
      (request.params as Record<string, string>)?.[marketIdParam] ||
      (request.body as Record<string, string>)?.['marketId'];

    if (requestedMarketId && requestedMarketId !== request.user!.marketId) {
      reply.status(403).send({
        error: {
          message: 'Access denied to this market',
          code: 'FORBIDDEN',
        },
      });
      return false;
    }
    return true;
  };
}

