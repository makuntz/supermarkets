# Arquitetura e Decisões Técnicas

## Visão Geral

Este documento descreve a arquitetura do sistema de comparação de preços de mercados, incluindo decisões técnicas e estratégias de implementação.

## Estrutura do Monorepo

```
supermarkets/
├── apps/
│   ├── backend/              # API Fastify + Prisma
│   │   ├── src/
│   │   │   ├── config/       # Configurações (env, database)
│   │   │   ├── domain/        # Entidades de domínio
│   │   │   ├── repositories/  # Interfaces e implementações de acesso a dados
│   │   │   ├── usecases/      # Lógica de negócio
│   │   │   ├── services/      # Serviços de domínio (ImportService, etc)
│   │   │   ├── workers/       # Processadores de jobs (ImportProcessor, etc)
│   │   │   ├── queue/         # Queue Provider (interface + InMemoryQueue)
│   │   │   ├── auth/          # Autenticação (JWT, bcrypt, guards RBAC)
│   │   │   ├── http/          # Rotas e handlers Fastify
│   │   │   ├── plugins/       # Plugins Fastify (Prisma, etc)
│   │   │   └── server.ts      # Bootstrap do servidor
│   │   └── prisma/            # Schema e migrações
│   ├── api-worker/            # Worker para processamento assíncrono
│   │   └── src/
│   │       ├── config/        # Configurações
│   │       └── worker.ts      # Bootstrap do worker
│   ├── mobile/                # App React Native + Expo (Consumer)
│   │   ├── src/
│   │   │   ├── screens/       # Telas do app
│   │   │   ├── navigation/    # Configuração de navegação
│   │   │   ├── services/      # API client e serviços
│   │   │   ├── store/         # Estado global (Zustand)
│   │   │   └── config/        # Configurações
│   │   └── App.tsx            # Entry point
│   └── market-portal/         # Portal Web Next.js (Market B2B)
│       └── src/
│           ├── app/           # Next.js App Router (pages)
│           ├── services/      # API client
│           └── middleware/   # Auth guards
├── packages/
│   └── shared/                # Tipos e utilitários compartilhados
│       └── src/
│           ├── types/         # Tipos TypeScript compartilhados
│           ├── api/           # Constantes de endpoints
│           └── jobs/          # Tipos de jobs
└── docker-compose.yml         # PostgreSQL + Redis (opcional)
```

## Camadas do Backend

### Domain Layer
- **Responsabilidade**: Entidades de domínio puras, sem dependências de infraestrutura
- **Exemplo**: `ProductEntity`, `MarketEntity`
- **Por quê**: Separação clara entre regras de negócio e detalhes de implementação

### Repository Layer
- **Responsabilidade**: Abstração de acesso a dados
- **Interface**: Define contratos (ex: `ProductRepository`)
- **Implementação**: `PrismaProductRepository` (usando Prisma)
- **Por quê**: Facilita testes e troca de implementação (ex: mock em testes)

### Use Cases Layer
- **Responsabilidade**: Orquestração de lógica de negócio
- **Exemplo**: `SearchProductsUseCase`
- **Por quê**: Centraliza regras de negócio, reutilizável entre diferentes interfaces (HTTP, CLI, etc)

### Services Layer
- **Responsabilidade**: Serviços de domínio que orquestram múltiplos repositórios
- **Exemplo**: `ImportService` (cria batch, enfileira job)
- **Por quê**: Encapsula lógica complexa que envolve múltiplas entidades

### Workers Layer
- **Responsabilidade**: Processamento assíncrono de jobs
- **Exemplo**: `ImportProcessor` (processa planilhas)
- **Por quê**: Isola processamento pesado do servidor HTTP

### HTTP Layer
- **Responsabilidade**: Rotas, validação de entrada, serialização de saída
- **Por quê**: Isola detalhes de protocolo HTTP do domínio

## Multi-Tenant e Autenticação

### Modelo Multi-Tenant
- **Escolha**: Join table `MarketUser` (não `user.marketId` direto)
- **Por quê**: 
  - Permite que um usuário tenha acesso a múltiplos mercados no futuro
  - Mais flexível para evoluir (ex: usuário consultor que gerencia vários mercados)
  - Separação clara de roles por mercado

### Autenticação
- **Consumer**: Login opcional (V1 sem auth, futuro OAuth)
- **Market Users**: Login obrigatório via JWT
- **Tokens**: Access token (15min) + Refresh token (7d)
- **Guards RBAC**: 
  - `requireAuth()` - Qualquer usuário autenticado
  - `requireRole(role)` - Role específica (ADMIN, etc)
  - `requireMarketUser()` - Deve ser market user
  - `requireMarketRole(role)` - Role dentro do mercado (OPERATOR, MANAGER, OWNER)
  - `requireMarketAccess()` - Acesso ao mercado específico (multi-tenant)

### Processamento Assíncrono
- **Escolha**: Interface `IQueueProvider` + `InMemoryQueue` (dev) → BullMQ (prod)
- **Por quê**: 
  - Flexibilidade para trocar implementação
  - InMemoryQueue suficiente para desenvolvimento
  - BullMQ com Redis para produção (retry, delay, prioridades)
- **Worker separado**: `api-worker` processa jobs em background

## Modelagem do Banco de Dados

### Tabelas Principais

#### `users`
- Usuários do sistema (consumer ou market user)
- `role`: CONSUMER (login opcional) ou ADMIN
- `passwordHash`: bcrypt hash

#### `market_users`
- Join table User ↔ Market
- `role`: OPERATOR, MANAGER, OWNER (role dentro do mercado)
- Permite multi-tenant: um usuário pode ter acesso a múltiplos mercados

#### `markets`
- Armazena informações dos mercados/supermercados
- `slug` único para URLs amigáveis
- `isActive` para controle de disponibilidade

#### `products`
- Produto canônico (normalizado)
- `nameNormalized` para busca eficiente (lowercase, sem acentos)
- `ean` único quando disponível (código de barras)
- Índice GIN para busca full-text (criar via migration SQL)

#### `market_products`
- Produto específico de um mercado (nome original)
- Link opcional para `products` (quando mapeado)
- Permite manter nome original do mercado mesmo após normalização

#### `offers`
- Preço atual de um produto em um mercado
- Pode estar ligado a `marketProductId` (produto do mercado) ou `productId` (canônico)
- `validFrom` e `validUntil` controlam validade do preço
- `isAvailable` indica disponibilidade

#### `import_batches`
- Lote de importação de planilha
- Rastreia status e progresso do processamento
- **Auditoria**: `createdByUserId`, `fileAssetId`, `summary` (JSON)

#### `import_rows`
- Linhas brutas importadas (JSON)
- Permite auditoria e reprocessamento

#### `file_assets`
- Referência a arquivos armazenados (planilhas, etc)
- `storageKey`: chave no storage (S3 key, local path)
- `provider`: local, s3, gcs, etc

#### `refresh_tokens`
- Refresh tokens para renovação de access tokens
- `revokedAt` para revogação

#### `price_history`
- Histórico de preços (opcional)
- Útil para análises e gráficos de tendência

### Índices Estratégicos

- `products.nameNormalized` (GIN): Busca rápida por nome (full-text)
- `products.ean`: Lookup por código de barras
- `offers.productId + isAvailable + validUntil`: Busca de ofertas válidas
- `market_products.marketId + nameNormalized`: Busca por mercado
- `import_batches.marketId + createdAt`: Busca ordenada por data
- `import_rows.importBatchId + rowNumber`: Busca ordenada por linha

## Estratégias de Normalização e Deduplicação

### Normalização de Nomes

**Estratégia proposta:**
1. Converter para lowercase
2. Remover acentos (normalização Unicode NFD + remoção de diacríticos)
3. Tokenizar (split por espaços e pontuação)
4. Remover stopwords comuns (ex: "de", "da", "do", "a", "o")
5. Ordenar tokens e juntar (para normalizar ordem)

**Exemplo:**
- "Arroz Tio João 5kg" → "arroz joao tio 5kg" → "5kg arroz joao tio"
- "ARROZ TIO JOÃO 5 KG" → "5kg arroz joao tio"

**Implementação futura:**
- Função utilitária em `packages/shared/src/utils/normalize.ts`
- Aplicar no backend durante import e no mobile durante busca

### Deduplicação de Produtos

**Prioridade 1: EAN/SKU**
- Se `marketProduct.ean` existe e já existe `Product` com mesmo EAN → mapear
- EAN é o identificador mais confiável

**Prioridade 2: Nome Normalizado + Brand + Size**
- Se não houver EAN, tentar match por:
  - `nameNormalized` similar (fuzzy match ou exato)
  - `brand` igual (quando disponível)
  - `size` igual (quando disponível)

**Prioridade 3: Fuzzy Matching**
- Usar algoritmo de similaridade (ex: Levenshtein, Jaro-Winkler)
- Threshold configurável (ex: 85% de similaridade)
- Permitir revisão manual quando necessário

**Implementação futura:**
- Use case `DeduplicateProductsUseCase`
- Processo assíncrono após import
- Interface admin para revisar matches duvidosos

## Fluxo de Importação (Fase 2)

### Processo Proposto

1. **Upload da Planilha**
   - Market user faz upload via portal
   - Arquivo salvo em `FileAsset` (local ou S3)
   - Cria `ImportBatch` com status `PENDING`
   - `createdByUserId` registra quem fez upload

2. **Enfileiramento**
   - `ImportService.createImportBatch()` enfileira job `IMPORT_EXCEL_BATCH`
   - Job contém `batchId`, `marketId`, `fileAssetId`

3. **Processamento (Worker)**
   - Worker processa job:
     - Atualiza status para `PROCESSING`
     - Busca `FileAsset` e faz download
     - Parse Excel (xlsx) linha por linha
     - Para cada linha:
       - Cria `ImportRow` com dados brutos (JSON)
       - Normaliza nome do produto
       - Tenta deduplicar (busca EAN ou nome normalizado)
       - Cria/atualiza `MarketProduct`
       - Cria/atualiza `Offer` (upsert por `marketId + marketProductId`)
     - Atualiza `ImportBatch` com `summary` (ok/erros/skipped)

4. **Finalização**
   - Atualiza `ImportBatch.status = COMPLETED`
   - Atualiza `ImportBatch.processedRows`
   - Em caso de erro: `status = FAILED`, salva `errorMessage`

## Fluxo de Busca (Fase 2)

### Processo Proposto

1. **Recebe Query**
   - Endpoint: `GET /api/products/search?q=arroz+5kg`
   - Valida e normaliza query

2. **Busca Produtos**
   - Busca em `Product` por `nameNormalized` (LIKE ou full-text search com GIN)
   - Filtra por `marketIds` se fornecido
   - Limita resultados (pagination)

3. **Agrega Ofertas**
   - Para cada produto encontrado:
     - Busca `Offer` onde `productId = product.id`
     - Filtra por `isAvailable = true` e `validUntil >= NOW()`
     - Inclui `Market` e `MarketProduct` relacionados
     - Ordena por preço (menor primeiro)

4. **Retorna Resultado**
   - Formato padronizado conforme `SearchProductResponse`
   - Inclui total para paginação

## Decisões Técnicas

### Backend: Fastify vs Express
- **Escolha**: Fastify
- **Por quê**: Melhor performance, TypeScript nativo, schema validation integrado

### Mobile: Zustand vs React Query
- **Escolha**: Zustand (inicial)
- **Por quê**: Mais simples para estado local reativo, sem overhead de cache complexo
- **Futuro**: Migrar para React Query se precisar de cache avançado, sincronização, etc.

### Portal: Next.js App Router
- **Escolha**: Next.js 14 com App Router
- **Por quê**: SSR/SSG, routing simples, TypeScript nativo, bom para dashboards

### Monorepo: Workspaces
- **Escolha**: npm workspaces
- **Por quê**: Nativo, sem dependências extras, suficiente para começar
- **Futuro**: Considerar Turborepo ou Nx se build times crescerem

### Banco: PostgreSQL
- **Escolha**: PostgreSQL
- **Por quê**: Robusto, suporta full-text search (GIN), JSON, índices avançados, open-source

### ORM: Prisma
- **Escolha**: Prisma
- **Por quê**: Type-safe, migrations automáticas, Prisma Studio, bom DX

### Queue: InMemory → BullMQ
- **Escolha**: Interface `IQueueProvider` + `InMemoryQueue` (dev) → BullMQ (prod)
- **Por quê**: Flexibilidade, InMemory suficiente para dev, BullMQ robusto para produção

## Ganchos para Futuro

### Autenticação Consumer
- Estrutura preparada para OAuth (Google, Apple, etc)
- Consumer pode usar app sem login (V1)
- Login opcional para favoritos, histórico, etc

### Cache
- Redis pode ser adicionado para cache de buscas frequentes
- Plugin Fastify para Redis
- Invalidação ao atualizar ofertas

### Storage
- Abstração `FileAsset` permite trocar local → S3/GCS
- `STORAGE_PROVIDER` env var controla provider

### Processamento Assíncrono
- Migrar para BullMQ quando necessário (retry, delay, prioridades)
- Worker pode escalar horizontalmente

## Próximos Passos

1. **Fase 2: Import**
   - Endpoint de upload de planilha
   - Parser de Excel (xlsx)
   - Processamento assíncrono real
   - Normalização e deduplicação

2. **Fase 2: Busca**
   - Endpoint de busca
   - Full-text search no PostgreSQL (GIN)
   - Agregação de ofertas
   - Paginação

3. **Fase 2: Auth**
   - Implementar login real (market portal)
   - Refresh token rotation
   - OAuth para consumer (futuro)

4. **Fase 3: UI**
   - Design system
   - Componentes reutilizáveis
   - Animações
   - Loading states

5. **Fase 4: Features**
   - Favoritos
   - Notificações de preço
   - Histórico de preços
   - Comparação lado a lado
