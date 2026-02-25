# Árvore de Diretórios

Estrutura completa do projeto:

```
supermarkets/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── database.ts      # Prisma client
│   │   │   │   └── env.ts           # Validação de env vars (Zod)
│   │   │   ├── domain/
│   │   │   │   ├── Product.ts       # Entidade Product
│   │   │   │   └── Market.ts        # Entidade Market
│   │   │   ├── repositories/
│   │   │   │   ├── ProductRepository.ts        # Interface
│   │   │   │   ├── PrismaProductRepository.ts  # Implementação
│   │   │   │   └── MarketRepository.ts
│   │   │   ├── usecases/
│   │   │   │   └── SearchProductsUseCase.ts    # Lógica de busca (placeholder)
│   │   │   ├── http/
│   │   │   │   └── routes/
│   │   │   │       ├── index.ts     # Registro de rotas
│   │   │   │       ├── health.ts    # Health check
│   │   │   │       └── products.ts  # Rotas de produtos (placeholder)
│   │   │   ├── plugins/
│   │   │   │   └── prisma.ts        # Plugin Fastify para Prisma
│   │   │   └── server.ts            # Bootstrap do servidor
│   │   ├── .eslintrc.json
│   │   ├── env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/
│       ├── src/
│       │   ├── screens/
│       │   │   ├── HomeScreen.tsx           # Tela de busca
│       │   │   ├── SearchResultsScreen.tsx  # Resultados
│       │   │   ├── ProductDetailScreen.tsx  # Detalhes
│       │   │   └── FavoritesScreen.tsx      # Favoritos
│       │   ├── navigation/
│       │   │   └── AppNavigator.tsx         # Config de navegação
│       │   ├── services/
│       │   │   └── api/
│       │   │       ├── client.ts            # API client base
│       │   │       └── products.ts          # Service de produtos
│       │   ├── store/
│       │   │   └── searchStore.ts           # Zustand store
│       │   └── config/
│       │       └── env.ts                   # Config de env vars
│       ├── .eslintrc.json
│       ├── app.json                         # Config Expo
│       ├── babel.config.js
│       ├── env.example
│       ├── index.js                         # Entry point
│       ├── App.tsx                          # Componente raiz
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types/
│       │   │   └── index.ts         # Tipos compartilhados
│       │   ├── api/
│       │   │   └── index.ts         # Constantes de endpoints
│       │   └── index.ts             # Export principal
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── .prettierrc
├── .prettierignore
├── ARCHITECTURE.md              # Documentação de arquitetura
├── TREE.md                      # Este arquivo
├── README.md                    # Guia de setup
├── docker-compose.yml           # PostgreSQL
├── package.json                 # Root (workspaces)
└── tsconfig.json                # Config TypeScript raiz
```

## Explicação das Pastas

### `/apps/backend`
Backend Fastify com arquitetura em camadas:
- **config/**: Configurações (banco, env vars)
- **domain/**: Entidades de domínio puras
- **repositories/**: Interfaces e implementações de acesso a dados
- **usecases/**: Lógica de negócio
- **http/**: Camada HTTP (rotas, handlers)
- **plugins/**: Plugins Fastify

### `/apps/mobile`
App React Native com Expo:
- **screens/**: Telas do app
- **navigation/**: Configuração de navegação (React Navigation)
- **services/**: API client e serviços externos
- **store/**: Estado global (Zustand)
- **config/**: Configurações do app

### `/packages/shared`
Package compartilhado entre backend e mobile:
- **types/**: Tipos TypeScript compartilhados
- **api/**: Constantes de endpoints

### `/prisma`
Schema do banco de dados e migrações:
- **schema.prisma**: Modelagem completa
- **migrations/**: Histórico de migrações

