# Changelog - Evolução da Arquitetura

## V2 - Multi-Tenant + Auth + Worker + Portal

### ✅ Schema Prisma Atualizado

**Novas Tabelas:**
- `users` - Usuários do sistema (consumer ou market user)
- `market_users` - Join table User ↔ Market (multi-tenant)
- `file_assets` - Referência a arquivos armazenados
- `refresh_tokens` - Refresh tokens para renovação

**Tabelas Atualizadas:**
- `import_batches` - Adicionado `createdByUserId`, `fileAssetId`, `summary`
- `offers` - Adicionado `validFrom` (além de `validUntil`)
- `products` - Preparado para índice GIN (full-text search)

**Novos Enums:**
- `UserRole`: CONSUMER, ADMIN
- `MarketUserRole`: OPERATOR, MANAGER, OWNER
- `ImportStatus`: PENDING, PROCESSING, COMPLETED, FAILED (mantido)

**Índices Adicionados:**
- `products.nameNormalized` (preparado para GIN)
- `offers.validFrom`
- `offers.marketId + productId`
- `offers.marketId + marketProductId`
- `import_batches.marketId + createdAt`
- `import_rows.importBatchId + rowNumber`

### ✅ Módulo de Autenticação

**Arquivos Criados:**
- `src/auth/hash.ts` - Bcrypt para hash de senhas
- `src/auth/jwt.ts` - Geração e validação de JWT
- `src/auth/middleware.ts` - Middleware Fastify para extrair user
- `src/auth/guards.ts` - Guards RBAC (requireAuth, requireRole, requireMarketUser, etc)

**Dependências Adicionadas:**
- `bcrypt` + `@types/bcrypt`
- `jsonwebtoken` + `@types/jsonwebtoken`

### ✅ Rotas de Autenticação

**Arquivos Criados:**
- `src/http/routes/auth.ts` - Rotas placeholder (login, refresh, me)

**Rotas:**
- `POST /api/auth/login` - Login (placeholder)
- `POST /api/auth/refresh` - Refresh token (placeholder)
- `GET /api/auth/me` - Dados do usuário (placeholder)

### ✅ Estrutura de Jobs/Worker

**Arquivos Criados:**
- `packages/shared/src/jobs/index.ts` - Tipos de jobs compartilhados
- `src/queue/QueueProvider.ts` - Interface IQueueProvider
- `src/queue/InMemoryQueue.ts` - Implementação in-memory (dev)
- `src/services/ImportService.ts` - Serviço de import (cria batch, enfileira job)
- `src/workers/ImportProcessor.ts` - Processador de imports (placeholder)

**Novo App:**
- `apps/api-worker/` - Worker separado para processamento assíncrono
  - `src/worker.ts` - Bootstrap do worker
  - `src/config/` - Configurações

### ✅ Market Portal (Next.js)

**Estrutura Criada:**
- `apps/market-portal/` - Portal web para mercados
  - `src/app/login/` - Tela de login (placeholder)
  - `src/app/dashboard/` - Dashboard (placeholder)
  - `src/app/imports/` - Lista de imports (placeholder)
  - `src/app/imports/[id]/` - Detalhes do import (placeholder)
  - `src/services/api/` - API client
  - `src/middleware/auth.ts` - Auth guard

### ✅ Configurações Atualizadas

**Docker Compose:**
- Adicionado Redis (opcional, profile `queue`)
- Mantido PostgreSQL

**Env Examples:**
- `apps/backend/env.example` - Adicionado JWT_SECRET, REFRESH_SECRET, STORAGE_PROVIDER
- `apps/api-worker/env.example` - Criado
- `apps/market-portal/env.example` - Criado

**Package.json Root:**
- Adicionado scripts: `dev:worker`, `dev:portal`

### ✅ Documentação Atualizada

**README.md:**
- Atualizado com novos apps (worker, portal)
- Instruções de setup atualizadas
- Decisões arquiteturais atualizadas (multi-tenant, auth, worker)

**ARCHITECTURE.md:**
- Seção de Multi-Tenant e Autenticação
- Seção de Processamento Assíncrono
- Modelagem atualizada com novas tabelas
- Fluxos atualizados

## Decisões de Design

### Multi-Tenant: Join Table vs Campo Direto
**Escolha**: Join table `MarketUser`
**Justificativa**: Permite que um usuário tenha acesso a múltiplos mercados no futuro, mais flexível para evoluir.

### Queue: Interface vs Implementação Direta
**Escolha**: Interface `IQueueProvider` + `InMemoryQueue`
**Justificativa**: Flexibilidade para trocar implementação (InMemory → BullMQ) sem mudar código de negócio.

### Worker: Separado vs Integrado
**Escolha**: App separado (`api-worker`)
**Justificativa**: Escalabilidade independente, processamento não bloqueia API.

### Auth: Consumer Opcional vs Obrigatório
**Escolha**: Consumer sem auth (V1), Market users obrigatório
**Justificativa**: Reduz fricção para consumer, segurança para B2B.

## Próximos Passos (Fase 2)

1. Implementar login real (market portal)
2. Implementar upload de planilha
3. Implementar parse de Excel
4. Implementar normalização e deduplicação
5. Migrar para BullMQ (produção)
6. Implementar endpoints de busca (consumer)

