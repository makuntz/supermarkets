// Configuração de variáveis de ambiente
// Expo usa EXPO_PUBLIC_ prefix para variáveis públicas

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  apiPrefix: process.env.EXPO_PUBLIC_API_PREFIX || '/api',
} as const;

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.apiUrl.replace(/\/$/, '');
  const prefix = config.apiPrefix.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${prefix}${path}`;
};

