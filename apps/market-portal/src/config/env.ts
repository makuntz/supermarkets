// Configuração de variáveis de ambiente

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  apiPrefix: process.env.NEXT_PUBLIC_API_PREFIX || '/api',
} as const;

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.apiUrl.replace(/\/$/, '');
  const prefix = config.apiPrefix.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${prefix}${path}`;
};

