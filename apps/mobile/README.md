# Mobile - React Native + Expo

App mobile para comparação de preços entre mercados.

## Estrutura

- **screens/**: Telas do app
- **navigation/**: Configuração de navegação (React Navigation)
- **services/**: API client e serviços
- **store/**: Estado global (Zustand)
- **config/**: Configurações

## Scripts

- `npm run dev` - Inicia Expo dev server
- `npm run android` - Abre no Android
- `npm run ios` - Abre no iOS
- `npm run web` - Abre no navegador
- `npm run lint` - Executa ESLint
- `npm run type-check` - Verifica tipos TypeScript

## Variáveis de Ambiente

Ver `env.example` para referência.

- `EXPO_PUBLIC_API_URL`: URL base da API (ex: http://localhost:3000)
- `EXPO_PUBLIC_API_PREFIX`: Prefixo da API (padrão: /api)

**Importante**: Para desenvolvimento em dispositivo físico, use o IP da máquina em vez de `localhost`.

Exemplo:
```
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

## Navegação

- **Home**: Tela de busca inicial
- **SearchResults**: Resultados da busca
- **ProductDetail**: Detalhes do produto
- **Favorites**: Produtos favoritos (placeholder)

## Estado

Usa Zustand para gerenciamento de estado local. Store principal: `searchStore`.

## Próximas Features (Fase 2)

- Integração com API de busca
- UI completa das telas
- Favoritos funcionais
- Histórico de preços
- Notificações

