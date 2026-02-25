// API Client base
// Wrapper sobre fetch para requisições HTTP

import { getApiUrl } from '../../config/env';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export class ApiClient {
  private getAuthToken(): string | null {
    // TODO: Buscar token do localStorage/cookie
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);

    const token = this.getAuthToken();
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.error?.message || `HTTP ${response.status}`,
          statusCode: response.status,
        };
        throw error;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw {
        message: error instanceof Error ? error.message : 'Network error',
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();

