// JWT utilities
// Geração e validação de tokens JWT

import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  marketId?: string; // Quando for market user
  marketRole?: string; // Role dentro do mercado
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.REFRESH_SECRET, {
    expiresIn: env.REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

