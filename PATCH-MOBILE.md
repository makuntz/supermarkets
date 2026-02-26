# PATCH: Correção Mobile Expo Go

## ✅ Arquivos Alterados

### 1. `apps/mobile/App.tsx`
**Antes:**
```tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
```

**Depois:**
```tsx
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
```

**Mudanças:**
- Removido `import React` (não necessário no React 17+)
- Ordem ajustada: `AppNavigator` primeiro, `StatusBar` depois

### 2. `package.json` (raiz)
**Antes:**
```json
"dev:mobile": "npm run dev --workspace=apps/mobile",
```

**Depois:**
```json
"dev:mobile": "npm --prefix apps/mobile run dev",
```

**Mudanças:**
- Usa `--prefix` para garantir que o Expo rode no diretório correto
- Evita que o Expo procure `App` na raiz do monorepo

### 3. `apps/mobile/package.json`
**Antes:**
```json
"main": "AppEntry.js",
```

**Depois:**
```json
"main": "index.js",
```

**Mudanças:**
- Volta para `index.js` (padrão do Expo)

### 4. `apps/mobile/app.json`
**Antes:**
```json
{
  "expo": {
    "main": "AppEntry.js",
    ...
  }
}
```

**Depois:**
```json
{
  "expo": {
    ...
  }
}
```

**Mudanças:**
- Removido `"main"` (Expo usa o `main` do `package.json`)

### 5. `apps/mobile/AppEntry.js`
**Removido** - Não é necessário, `index.js` já faz o trabalho.

### 6. `apps/mobile/index.js`
**Sem mudanças** - Já estava correto:
```js
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

## 🧪 Comandos para Validação

### 1. Verificar estrutura
```bash
cd /home/makuntz/Área\ de\ trabalho/Supermarket/supermarkets

# Verificar que index.js existe e está correto
cat apps/mobile/index.js

# Verificar que App.tsx está correto
cat apps/mobile/App.tsx

# Verificar que AppEntry.js foi removido
test -f apps/mobile/AppEntry.js && echo "ERRO: AppEntry.js ainda existe" || echo "OK: AppEntry.js removido"
```

### 2. Testar script da raiz
```bash
# Da raiz do monorepo
npm run dev:mobile
```

**Esperado:**
- Expo inicia sem erro `Unable to resolve "../../App"`
- QR Code aparece no terminal
- App abre no Expo Go

### 3. Testar diretamente no diretório mobile
```bash
cd apps/mobile
npm run dev
```

**Esperado:**
- Mesmo comportamento do passo 2

### 4. Validar no Expo Go
1. Escanear QR Code com Expo Go
2. App deve abrir
3. Deve mostrar navegação (tela de busca)

## ✅ Checklist de Validação

- [ ] `npm run dev:mobile` da raiz funciona sem erro `../../App`
- [ ] Expo Go conecta e abre o app
- [ ] App renderiza a navegação (tela de busca visível)
- [ ] Sem erros no console do Expo Go

## 🔍 Troubleshooting

Se ainda der erro `../../App`:
```bash
# Limpar cache do Expo
cd apps/mobile
rm -rf .expo node_modules/.cache
npx expo start --clear
```

Se o app não abrir no Expo Go:
- Verificar se celular e PC estão na mesma rede Wi-Fi
- Verificar se backend está rodando (se app tentar conectar)
- Ver logs no terminal do Expo

