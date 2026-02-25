// Auth API service
// Placeholder para endpoints de autenticação

import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    marketId?: string;
  };
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // TODO: Implementar quando endpoint estiver pronto
    throw new Error('Not implemented');
  },

  logout: async (): Promise<void> => {
    // TODO: Limpar tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  getMe: async () => {
    // TODO: Implementar quando endpoint estiver pronto
    throw new Error('Not implemented');
  },
};

