# Arquitetura e Decisões Técnicas

## Visão Geral

Este documento descreve a arquitetura inicial do sistema de comparação de preços de mercados, incluindo decisões técnicas e estratégias de implementação.

## Estrutura do Monorepo

```
supermarkets/
├── apps/
│   ├── backend/              # API Fastify + Prisma
│   │   ├── src/
│   │   │   ├── config/       # Configurações (env, database)
│   │   │   ├── domain/       # Entidades de domínio
│   │   │   ├── repositories/ # Interfaces e implementações de acesso a dados
│   │   │   ├── usecases/     # Lógica de negócio
│   │   │   ├── http/         # Rotas e handlers Fastify
│   │   │   ├── plugins/      # Plugins Fastify (Prisma, etc)
│   │   │   └── server.ts     # Bootstrap do servidor
│   │   └── prisma/           # Schema e migrações
│   └── mobile/               # App React Native + Expo
│       ├── src/
│       │   ├── screens/      # Telas do app
│       │   ├── navigation/  # Configuração de navegação
│       │   ├── services/    # API client e serviços
│       │   ├── store/       # Estado global (Zustand)
│       │   └── config/      # Configurações
│       └── App.tsx           # Entry point
├── packages/
│   └── shared/               # Tipos e utilitários compartilhados
│       └── src/
│           ├── types/        # Tipos TypeScript compartilhados
│           └── api/          # Constantes de endpoints
└── docker-compose.yml        # PostgreSQL local
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

### HTTP Layer
- **Responsabilidade**: Rotas, validação de entrada, serialização de saída
- **Por quê**: Isola detalhes de protocolo HTTP do domínio

## Modelagem do Banco de Dados

### Tabelas Principais

#### `markets`
- Armazena informações dos mercados/supermercados
- `slug` único para URLs amigáveis
- `isActive` para controle de disponibilidade

#### `products`
- Produto canônico (normalizado)
- `nameNormalized` para busca eficiente (lowercase, sem acentos)
- `ean` único quando disponível (código de barras)

#### `market_products`
- Produto específico de um mercado (nome original)
- Link opcional para `products` (quando mapeado)
- Permite manter nome original do mercado mesmo após normalização

#### `offers`
- Preço atual de um produto em um mercado
- Pode estar ligado a `marketProductId` (produto do mercado) ou `productId` (canônico)
- `validUntil` controla validade do preço
- `isAvailable` indica disponibilidade

#### `import_batches`
- Lote de importação de planilha
- Rastreia status e progresso do processamento

#### `import_rows`
- Linhas brutas importadas (JSON)
- Permite auditoria e reprocessamento

#### `price_history`
- Histórico de preços (opcional)
- Útil para análises e gráficos de tendência

### Índices Estratégicos

- `products.nameNormalized`: Busca rápida por nome
- `products.ean`: Lookup por código de barras
- `offers.productId + isAvailable + validUntil`: Busca de ofertas válidas
- `market_products.marketId + nameNormalized`: Busca por mercado

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
   - Admin faz upload via endpoint (futuro)
   - Arquivo salvo temporariamente
   - Cria `ImportBatch` com status `PENDING`

2. **Processamento**
   - Worker/job processa planilha linha por linha
   - Para cada linha:
     - Cria `ImportRow` com dados brutos (JSON)
     - Normaliza nome do produto
     - Tenta deduplicar (busca EAN ou nome normalizado)
     - Cria/atualiza `MarketProduct`
     - Cria/atualiza `Offer` (upsert por `marketId + marketProductId`)

3. **Upsert de Ofertas**
   - Chave: `marketId + marketProductId` (ou `productId` quando mapeado)
   - Se existe → atualiza `price`, `validUntil`, `isAvailable`
   - Se não existe → cria nova
   - Opcionalmente: cria entrada em `PriceHistory` antes de atualizar

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
   - Busca em `Product` por `nameNormalized` (LIKE ou full-text search)
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

### Monorepo: Workspaces
- **Escolha**: npm workspaces
- **Por quê**: Nativo, sem dependências extras, suficiente para começar
- **Futuro**: Considerar Turborepo ou Nx se build times crescerem

### Banco: PostgreSQL
- **Escolha**: PostgreSQL
- **Por quê**: Robusto, suporta full-text search, JSON, índices avançados, open-source

### ORM: Prisma
- **Escolha**: Prisma
- **Por quê**: Type-safe, migrations automáticas, Prisma Studio, bom DX

## Ganchos para Futuro

### Autenticação
- Estrutura preparada para JWT
- Variáveis de ambiente reservadas (`JWT_SECRET`, `ADMIN_API_KEY`)
- Middleware de auth pode ser adicionado em `src/http/middleware/auth.ts`

### Perfis de Usuário
- Tabela `users` pode ser adicionada ao schema
- Relação com `favorites` (produtos favoritos)
- Middleware de autorização por role (admin/user)

### Cache
- Redis pode ser adicionado para cache de buscas frequentes
- Plugin Fastify para Redis
- Invalidação ao atualizar ofertas

### Processamento Assíncrono
- Bull/BullMQ para jobs de importação
- Worker separado para processar planilhas
- Queue para deduplicação em background

## Próximos Passos

1. **Fase 2: Import**
   - Endpoint de upload de planilha
   - Parser de Excel (xlsx)
   - Processamento assíncrono
   - Normalização e deduplicação

2. **Fase 2: Busca**
   - Endpoint de busca
   - Full-text search no PostgreSQL
   - Agregação de ofertas
   - Paginação

3. **Fase 3: UI**
   - Design system
   - Componentes reutilizáveis
   - Animações
   - Loading states

4. **Fase 4: Features**
   - Favoritos
   - Notificações de preço
   - Histórico de preços
   - Comparação lado a lado

