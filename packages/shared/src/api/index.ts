// Tipos e interfaces para comunicação API

export const API_ENDPOINTS = {
  HEALTH: '/health',
  PRODUCTS_SEARCH: '/api/products/search',
  PRODUCTS_DETAIL: '/api/products/:id',
  MARKETS: '/api/markets',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

