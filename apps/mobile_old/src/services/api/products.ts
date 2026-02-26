// API service para produtos
// A ser implementado quando endpoints estiverem prontos

import { apiClient } from './client';
import type { SearchProductRequest, SearchProductResponse } from '@supermarkets/shared';

export const productsApi = {
  search: async (params: SearchProductRequest): Promise<SearchProductResponse> => {
    // Implementação será adicionada quando endpoint estiver pronto
    throw new Error('Not implemented');
  },

  getById: async (id: string) => {
    // Implementação será adicionada quando endpoint estiver pronto
    throw new Error('Not implemented');
  },
};

