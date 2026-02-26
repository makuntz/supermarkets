#!/bin/bash
# Script para configurar banco de dados no PostgreSQL local

echo "🔧 Configurando banco de dados local..."

# Criar usuário (se não existir)
sudo -u postgres psql -c "CREATE USER supermarkets WITH PASSWORD 'supermarkets_dev';" 2>/dev/null || echo "Usuário já existe ou erro ao criar"

# Criar banco de dados
sudo -u postgres psql -c "CREATE DATABASE supermarkets_db OWNER supermarkets;" 2>/dev/null || echo "Banco já existe ou erro ao criar"

# Dar permissões
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE supermarkets_db TO supermarkets;" 2>/dev/null

echo "✅ Banco configurado!"
echo ""
echo "Agora você pode:"
echo "1. Gerar Prisma Client: npm run db:generate"
echo "2. Executar migrações: npm run db:migrate"

