# 🚀 Como Rodar o Projeto

## Pré-requisitos

- ✅ Node.js >= 18
- ✅ npm >= 9
- ✅ Docker e Docker Compose
- ✅ PostgreSQL rodando (porta 5433 via Docker)

## 📦 1. Instalar Dependências

```bash
npm install
```

Isso instala todas as dependências de todos os workspaces (backend, mobile, portal, worker, shared).

## 🗄️ 2. Banco de Dados

O PostgreSQL já está configurado e rodando na porta **5433**.

Para verificar:
```bash
docker ps | grep supermarkets-postgres
```

Para iniciar/parar:
```bash
docker-compose up -d postgres    # Iniciar
docker-compose down postgres     # Parar
```

## 🔧 3. Configurar Variáveis de Ambiente

Os arquivos `.env` já foram criados a partir dos exemplos. Se precisar ajustar:

- `apps/backend/.env` - Já configurado (porta 5433)
- `apps/mobile/.env` - API URL do backend
- `apps/market-portal/.env` - API URL do backend
- `apps/api-worker/.env` - Database URL

## 🎯 4. Rodar os Serviços

### Opção A: Rodar Tudo Separadamente (Recomendado para desenvolvimento)

Abra **4 terminais diferentes**:

#### Terminal 1: Backend API
```bash
npm run dev:backend
```
- ✅ Servidor em: **http://localhost:3000**
- ✅ Health check: http://localhost:3000/health

#### Terminal 2: Worker (Opcional - para processar jobs)
```bash
npm run dev:worker
```
- Processa jobs de import assíncronos

#### Terminal 3: Market Portal (Web - B2B)
```bash
npm run dev:portal
```
- ✅ Portal em: **http://localhost:3001**
- Telas: Login, Dashboard, Imports

#### Terminal 4: Mobile App (Consumer)
```bash
npm run dev:mobile
```
- Escaneie o QR code com Expo Go (iOS/Android)
- Ou pressione `a` para Android, `i` para iOS

### Opção B: Rodar Apenas o Essencial

Para começar, você só precisa do **Backend**:

```bash
# Terminal 1: Backend
npm run dev:backend
```

Depois pode adicionar:
- Portal: `npm run dev:portal` (Terminal 2)
- Mobile: `npm run dev:mobile` (Terminal 3)

## 🧪 5. Testar

### Backend
```bash
curl http://localhost:3000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

### Portal
Acesse: http://localhost:3001
- Redireciona para `/login` (placeholder)

### Mobile
- Abra Expo Go no celular
- Escaneie o QR code
- App abre com tela de busca

## 📊 6. Prisma Studio (GUI do Banco)

Para visualizar/editar dados do banco:

```bash
npm run db:studio
```

Acesse: **http://localhost:5555**

## 🔍 Comandos Úteis

```bash
# Ver logs do PostgreSQL
docker-compose logs postgres

# Ver containers rodando
docker ps

# Regenerar Prisma Client (se mudar schema)
npm run db:generate

# Criar nova migração
npm run db:migrate

# Lint em todos os projetos
npm run lint

# Formatar código
npm run format
```

## 🐛 Troubleshooting

### Erro: "Port already in use"
- Backend (3000): `lsof -ti:3000 | xargs kill -9`
- Portal (3001): `lsof -ti:3001 | xargs kill -9`

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando: `docker ps`
- Verifique a porta no `.env`: deve ser `5433`

### Erro: "Module not found"
- Execute: `npm install` novamente
- Limpe cache: `rm -rf node_modules && npm install`

### Mobile não conecta ao backend
- Use o IP da máquina no `.env` do mobile (não `localhost`)
- Exemplo: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`
- Descubra seu IP: `hostname -I | awk '{print $1}'`

## 📝 Estrutura dos Apps

```
apps/
├── backend/        # API Fastify (porta 3000)
├── api-worker/      # Worker assíncrono
├── mobile/         # App React Native + Expo
└── market-portal/  # Portal Next.js (porta 3001)
```

## 🎯 Próximos Passos

1. ✅ Banco configurado
2. ✅ Dependências instaladas
3. 🚀 Rodar backend: `npm run dev:backend`
4. 🚀 Rodar portal: `npm run dev:portal`
5. 🚀 Rodar mobile: `npm run dev:mobile`

