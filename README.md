# Supermarkets - Comparador de Preços

Monorepo para aplicação de comparação de preços entre mercados.

## Arquitetura

### Estrutura do Monorepo

```
supermarkets/
├── apps/
│   ├── backend/          # API Fastify + Prisma
│   └── mobile/           # App React Native + Expo
├── packages/
│   └── shared/           # Tipos, validações e utilitários compartilhados
└── docker-compose.yml    # PostgreSQL local
```

### Camadas do Backend

- **Domain**: Entidades e tipos de domínio
- **Repositories**: Interfaces e implementações de acesso a dados
- **UseCases**: Lógica de negócio (a ser implementada)
- **HTTP**: Rotas e handlers Fastify

### Fluxo de Dados

1. Admin faz upload de planilha Excel → `ImportBatch` → `ImportRow` (raw)
2. Processamento normaliza e cria/atualiza `Product` (canônico)
3. Cria/atualiza `MarketProduct` (produto do mercado) e `Offer` (preço atual)
4. App mobile busca `Product` → agrega `Offer` por mercado

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

### 4. Rodar aplicações

**Backend:**
```bash
npm run dev:backend
# Servidor estará em http://localhost:3000
# Health check: http://localhost:3000/health
```

**Mobile:**
```bash
npm run dev:mobile
# Escanear QR code com Expo Go (iOS/Android)
# Ou pressionar 'a' para Android, 'i' para iOS
```

### 5. Verificar funcionamento

1. Backend: Acesse `http://localhost:3000/health` - deve retornar `{"status":"ok"}`
2. Mobile: App deve abrir e mostrar tela de busca

## Scripts Disponíveis

- `npm run dev:backend` - Inicia backend em modo desenvolvimento
- `npm run dev:mobile` - Inicia app mobile (Expo)
- `npm run build` - Build de todos os workspaces
- `npm run lint` - Lint em todos os workspaces
- `npm run format` - Formata código com Prettier
- `npm run db:generate` - Gera Prisma Client
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre Prisma Studio

## Decisões Arquiteturais

### Normalização de Nomes
- Lowercase + remoção de acentos
- Tokenização (split por espaços/pontuação)
- Remoção de stopwords comuns
- Armazenado em `nameNormalized` para busca eficiente

### Deduplicação de Produtos
1. **Prioridade 1**: EAN/SKU quando disponível
2. **Prioridade 2**: `nameNormalized` + `brand` + `size` (quando disponível)
3. **Fallback**: Match por similaridade (fuzzy) - a implementar

### Atualização de Ofertas
- `ImportBatch` processa linhas e faz upsert de `Offer`
- Chave: `marketId` + `marketProductId` (ou `productId` quando mapeado)
- `Offer.validUntil` controla validade do preço
- Histórico opcional em `PriceHistory` para análises futuras

### Consulta do App
- Busca por `Product.nameNormalized` (LIKE ou full-text search)
- Agrega `Offer` por `productId` filtrando por `validUntil >= NOW()`
- Ordena por preço ou distância (futuro)

## Próximos Passos

- [ ] Implementar endpoints de import (admin)
- [ ] Implementar endpoints de busca (público)
- [ ] Implementar normalização e deduplicação
- [ ] Adicionar autenticação (JWT)
- [ ] Implementar favoritos
- [ ] Adicionar testes unitários e integração

