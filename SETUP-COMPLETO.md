# ✅ Setup do Banco de Dados - Completo!

## O que foi configurado:

1. ✅ **PostgreSQL no Docker** - Rodando na porta **5433** (para evitar conflito com PostgreSQL local)
2. ✅ **Arquivo .env** - Criado em `apps/backend/.env` com configurações corretas
3. ✅ **Prisma Client** - Gerado com sucesso
4. ✅ **Migrações** - Aplicadas com sucesso

## Tabelas criadas:

- ✅ `users` - Usuários do sistema
- ✅ `market_users` - Join table User ↔ Market
- ✅ `markets` - Mercados/supermercados
- ✅ `products` - Produtos canônicos
- ✅ `market_products` - Produtos dos mercados
- ✅ `offers` - Ofertas/preços
- ✅ `import_batches` - Lotes de importação
- ✅ `import_rows` - Linhas brutas importadas
- ✅ `file_assets` - Arquivos armazenados
- ✅ `refresh_tokens` - Tokens de refresh
- ✅ `price_history` - Histórico de preços

## Próximos passos:

### 1. Instalar dependências (se ainda não fez):
```bash
npm install
```

### 2. Rodar o backend:
```bash
npm run dev:backend
```

O servidor estará em: **http://localhost:3000**

### 3. Testar health check:
```bash
curl http://localhost:3000/health
```

Deve retornar: `{"status":"ok","timestamp":"...","database":"connected"}`

### 4. (Opcional) Abrir Prisma Studio:
```bash
npm run db:studio
```

Acesse: **http://localhost:5555**

## Comandos úteis:

- `docker ps` - Ver containers rodando
- `docker-compose logs postgres` - Ver logs do PostgreSQL
- `docker-compose down` - Parar containers
- `docker-compose up -d postgres` - Iniciar PostgreSQL
- `npm run db:generate` - Regenerar Prisma Client
- `npm run db:migrate` - Criar nova migração
- `npm run db:studio` - Abrir Prisma Studio

## Nota sobre a porta:

O PostgreSQL está rodando na porta **5433** (não 5432) para evitar conflito com o PostgreSQL local que você já tem instalado.

Se quiser usar o PostgreSQL local em vez do Docker, você pode:
1. Parar o container: `docker-compose down postgres`
2. Executar o script: `./scripts/setup-db-local.sh` (precisa de sudo)
3. Atualizar `.env` para usar `localhost:5432`

