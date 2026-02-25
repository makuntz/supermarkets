# Supermarkets - Comparador de Preços

Monorepo para aplicação de comparação de preços entre mercados.

## Arquitetura

### Estrutura do Monorepo

```
supermarkets/
├── apps/
│   ├── backend/          # API Fastify + Prisma
│   ├── api-worker/       # Worker para processamento assíncrono
│   ├── mobile/           # App React Native + Expo (Consumer)
│   └── market-portal/    # Portal Web Next.js (Market B2B)
├── packages/
│   └── shared/           # Tipos, validações e utilitários compartilhados
└── docker-compose.yml    # PostgreSQL + Redis (opcional)
```

### Tipos de Usuários

- **Consumer**: Usuário final do app mobile (login opcional - V1 sem auth)
- **Market User**: Usuário do mercado que faz upload via portal (login obrigatório)
- **Admin**: Admin interno do sistema

### Camadas do Backend

- **Domain**: Entidades e tipos de domínio
- **Repositories**: Interfaces e implementações de acesso a dados
- **UseCases**: Lógica de negócio
- **Services**: Serviços de domínio (ImportService, etc)
- **Workers**: Processadores de jobs assíncronos
- **HTTP**: Rotas e handlers Fastify
- **Auth**: Autenticação JWT + RBAC

### Fluxo de Import (Fase 2)

1. Market User faz upload de planilha Excel via Portal → `FileAsset` + `ImportBatch` (PENDING)
2. Backend enfileira job `IMPORT_EXCEL_BATCH`
3. Worker processa job:
   - Atualiza status para PROCESSING
   - Parse Excel → `ImportRow` (raw)
   - Normaliza e deduplica → `Product` (canônico)
   - Cria/atualiza `MarketProduct` e `Offer`
   - Atualiza status para COMPLETED/FAILED

### Fluxo de Busca (Consumer)

1. Consumer busca produto no app (sem auth obrigatória)
2. Backend busca `Product` por `nameNormalized`
3. Agrega `Offer` válidas por mercado
4. Retorna resultados ordenados por preço

## Pré-requisitos

- Node.js >= 18
- Docker e Docker Compose
- npm >= 9

## Setup Inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Aguardar banco estar pronto (alguns segundos)
# Verificar logs: docker-compose logs postgres

# Gerar Prisma Client
npm run db:generate

# Executar migrações (cria schema inicial)
npm run db:migrate
```

### 3. Configurar variáveis de ambiente

**Backend:**
```bash
cp apps/backend/env.example apps/backend/.env
# Editar apps/backend/.env se necessário
```

**Mobile:**
```bash
cp apps/mobile/env.example apps/mobile/.env
# Editar apps/mobile/.env se necessário
# Para desenvolvimento local, usar IP da máquina em vez de localhost
# Ex: EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

**Worker:**
```bash
cp apps/api-worker/env.example apps/api-worker/.env
# Editar se necessário
```

**Market Portal:**
```bash
cp apps/market-portal/env.example apps/market-portal/.env
# Editar se necessário
```

### 4. Rodar aplicações

**Backend API:**
```bash
npm run dev:backend
# Servidor estará em http://localhost:3000
# Health check: http://localhost:3000/health
```

**Worker (processamento assíncrono):**
```bash
npm run dev:worker
# Processa jobs de import em background
```

**Mobile (Consumer App):**
```bash
npm run dev:mobile
# Escanear QR code com Expo Go (iOS/Android)
# Ou pressionar 'a' para Android, 'i' para iOS
```

**Market Portal (B2B):**
```bash
npm run dev:portal
# Portal estará em http://localhost:3001
```

### 5. Verificar funcionamento

1. Backend: Acesse `http://localhost:3000/health` - deve retornar `{"status":"ok"}`
2. Mobile: App deve abrir e mostrar tela de busca
3. Portal: Acesse `http://localhost:3001` - redireciona para `/login`

## Scripts Disponíveis

- `npm run dev:backend` - Inicia backend API
- `npm run dev:worker` - Inicia worker (processamento assíncrono)
- `npm run dev:mobile` - Inicia app mobile (Expo)
- `npm run dev:portal` - Inicia Market Portal (Next.js)
- `npm run build` - Build de todos os workspaces
- `npm run lint` - Lint em todos os workspaces
- `npm run format` - Formata código com Prettier
- `npm run db:generate` - Gera Prisma Client
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre Prisma Studio

## Decisões Arquiteturais

### Multi-Tenant
- Cada `MarketUser` está vinculado a um `Market` via `MarketUser` (join table)
- Permite que um usuário tenha acesso a múltiplos mercados no futuro
- Guards RBAC garantem que market users só acessem dados do seu mercado

### Autenticação
- **Consumer**: Login opcional (V1 sem auth, futuro OAuth)
- **Market Users**: Login obrigatório via JWT (access + refresh tokens)
- RBAC com roles: `CONSUMER`, `ADMIN`, `MARKET_OPERATOR`, `MARKET_MANAGER`, `MARKET_OWNER`

### Processamento Assíncrono
- Queue Provider interface permite trocar implementação (InMemory → BullMQ)
- Jobs processados por worker separado (`api-worker`)
- ImportBatch rastreia status: PENDING → PROCESSING → COMPLETED/FAILED

### Normalização de Nomes
- Lowercase + remoção de acentos
- Tokenização (split por espaços/pontuação)
- Remoção de stopwords comuns
- Armazenado em `nameNormalized` para busca eficiente
- Índice GIN (pg_trgm) para busca full-text (criar via migration SQL)

### Deduplicação de Produtos
1. **Prioridade 1**: EAN/SKU quando disponível
2. **Prioridade 2**: `nameNormalized` + `brand` + `size` (quando disponível)
3. **Fallback**: Match por similaridade (fuzzy) - a implementar

### Atualização de Ofertas
- `ImportBatch` processa linhas e faz upsert de `Offer`
- Chave: `marketId` + `marketProductId` (ou `productId` quando mapeado)
- `Offer.validFrom` e `validUntil` controlam validade do preço
- Histórico opcional em `PriceHistory` para análises futuras

### Consulta do App
- Busca por `Product.nameNormalized` (LIKE ou full-text search com GIN)
- Agrega `Offer` por `productId` filtrando por `validUntil >= NOW()`
- Ordena por preço ou distância (futuro)

## Próximos Passos (Fase 2)

- [ ] Implementar endpoints de import (upload, listagem, detalhes)
- [ ] Implementar parse real de Excel (xlsx)
- [ ] Implementar normalização e deduplicação de produtos
- [ ] Implementar endpoints de busca (público para consumer)
- [ ] Implementar login real (market portal)
- [ ] Implementar favoritos (consumer)
- [ ] Migrar para BullMQ (Redis) em produção
- [ ] Adicionar testes unitários e integração

