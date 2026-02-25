# Backend - API Fastify

API backend para o sistema de comparação de preços.

## Estrutura

- **Domain**: Entidades de domínio puras
- **Repositories**: Interfaces e implementações de acesso a dados
- **UseCases**: Lógica de negócio
- **HTTP**: Rotas e handlers Fastify

## Scripts

- `npm run dev` - Inicia em modo desenvolvimento (watch)
- `npm run build` - Build para produção
- `npm run start` - Inicia versão compilada
- `npm run lint` - Executa ESLint
- `npm run db:generate` - Gera Prisma Client
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre Prisma Studio (GUI do banco)

## Variáveis de Ambiente

Ver `env.example` para referência.

- `DATABASE_URL`: Connection string do PostgreSQL
- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente (development/production/test)
- `API_PREFIX`: Prefixo das rotas da API (padrão: /api)

## Endpoints Disponíveis

- `GET /health` - Health check (verifica conexão com banco)

## Próximos Endpoints (Fase 2)

- `POST /api/admin/import` - Upload de planilha (admin)
- `GET /api/products/search` - Busca de produtos
- `GET /api/products/:id` - Detalhes do produto
- `GET /api/markets` - Lista de mercados

