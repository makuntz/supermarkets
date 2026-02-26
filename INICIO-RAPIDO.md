# ⚡ Início Rápido

## ✅ Tudo Configurado!

- ✅ Dependências instaladas
- ✅ Banco de dados rodando (PostgreSQL na porta 5433)
- ✅ Migrações aplicadas
- ✅ Arquivos .env criados

## 🚀 Rodar o Projeto

### 1. Backend (API) - OBRIGATÓRIO

```bash
npm run dev:backend
```

**Aguarde aparecer:** `🚀 Server listening on http://0.0.0.0:3000`

**Teste:** Abra http://localhost:3000/health no navegador ou:
```bash
curl http://localhost:3000/health
```

### 2. Market Portal (Web) - OPCIONAL

Em **outro terminal**:

```bash
npm run dev:portal
```

**Acesse:** http://localhost:3001

### 3. Mobile App - OPCIONAL

Em **outro terminal**:

```bash
npm run dev:mobile
```

- Escaneie QR code com **Expo Go** (app no celular)
- Ou pressione `a` (Android) / `i` (iOS)

### 4. Worker - OPCIONAL (só se for processar imports)

Em **outro terminal**:

```bash
npm run dev:worker
```

## 📝 Ordem Recomendada

1. **Primeiro:** Backend (`npm run dev:backend`)
2. **Depois:** Portal ou Mobile (escolha um para testar)

## 🔍 Verificar se Está Funcionando

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
- Deve mostrar tela de login

### Mobile
- App abre com tela de busca

## 🐛 Problemas?

### Porta 3000 ocupada?
```bash
lsof -ti:3000 | xargs kill -9
```

### Erro de conexão com banco?
```bash
docker ps | grep postgres  # Verificar se está rodando
docker-compose logs postgres  # Ver logs
```

### Dependências faltando?
```bash
npm install
```

## 📚 Mais Informações

Veja `COMO-RODAR.md` para guia completo.

