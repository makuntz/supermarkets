# 📱 App Mobile - React Native + Expo

## O que é Expo?

**Expo** é uma plataforma/framework que facilita o desenvolvimento de apps React Native. Com Expo você pode:

- ✅ Desenvolver apps iOS e Android com **uma única base de código**
- ✅ Testar no celular **sem precisar compilar** (usando o app Expo Go)
- ✅ Não precisa configurar Android Studio ou Xcode no início
- ✅ Hot reload automático (mudanças aparecem instantaneamente)

## Como Funciona?

### 1. Expo Go (App no Celular)

**Expo Go** é um app que você instala no seu celular (iOS ou Android) que permite rodar apps React Native em desenvolvimento **sem precisar compilar**.

- 📱 **iOS**: Baixe "Expo Go" na App Store
- 🤖 **Android**: Baixe "Expo Go" na Play Store

### 2. Desenvolvimento

Quando você roda `npm run dev:mobile`, o Expo:

1. Inicia um servidor de desenvolvimento
2. Gera um **QR Code** no terminal
3. Você escaneia o QR Code com o **Expo Go**
4. O app abre no seu celular e se conecta ao servidor
5. Qualquer mudança no código aparece **instantaneamente** no celular

## Como Rodar o App Mobile

### Passo 1: Instalar Expo Go no Celular

- **iOS**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### Passo 2: Rodar o Servidor

```bash
npm run dev:mobile
```

Você verá algo assim:

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### Passo 3: Conectar o Celular

**Opção A: QR Code (Recomendado)**
1. Abra o app **Expo Go** no celular
2. Toque em "Scan QR Code"
3. Escaneie o QR code que aparece no terminal
4. O app abre automaticamente

**Opção B: Manual**
1. Abra o app **Expo Go**
2. Digite a URL que aparece no terminal (ex: `exp://192.168.1.100:8081`)

### Passo 4: Desenvolvimento

- Qualquer mudança no código aparece **automaticamente** no celular
- Não precisa recompilar ou reinstalar
- Hot reload instantâneo

## Requisitos

### Para Desenvolvimento Básico (Expo Go)
- ✅ Celular iOS ou Android
- ✅ App Expo Go instalado
- ✅ Celular e computador na **mesma rede Wi-Fi**

### Para Compilar App Final (Opcional - Fase Final)
- Android Studio (para gerar APK/AAB)
- Xcode (para gerar IPA - apenas no macOS)

## Estrutura do App Mobile

```
apps/mobile/
├── src/
│   ├── screens/          # Telas do app
│   │   ├── HomeScreen.tsx        # Tela de busca
│   │   ├── SearchResultsScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   └── FavoritesScreen.tsx
│   ├── navigation/       # Navegação entre telas
│   ├── services/         # API client
│   ├── store/           # Estado global (Zustand)
│   └── config/          # Configurações
├── App.tsx              # Componente raiz
└── app.json            # Configuração do Expo
```

## Telas do App

1. **Home** - Tela inicial com busca de produtos
2. **SearchResults** - Resultados da busca
3. **ProductDetail** - Detalhes do produto e comparação de preços
4. **Favorites** - Produtos favoritos

## Configuração Importante

### API URL no Mobile

O app mobile precisa se conectar ao backend. No arquivo `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3000
```

**⚠️ IMPORTANTE**: Use o **IP da sua máquina**, não `localhost`!

Para descobrir seu IP:
```bash
hostname -I | awk '{print $1}'
# ou
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Exemplo:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

## Comandos Úteis

```bash
# Rodar app mobile
npm run dev:mobile

# Rodar no Android (emulador)
npm run dev:mobile
# Depois pressione 'a'

# Rodar no iOS (simulador - apenas macOS)
npm run dev:mobile
# Depois pressione 'i'

# Rodar no navegador (para testar rápido)
npm run dev:mobile
# Depois pressione 'w'
```

## Diferença: Expo Go vs App Compilado

### Expo Go (Desenvolvimento)
- ✅ Rápido para começar
- ✅ Não precisa compilar
- ✅ Testa no celular real
- ❌ Limitado a bibliotecas suportadas pelo Expo
- ❌ Não pode publicar na loja

### App Compilado (Produção)
- ✅ App completo e independente
- ✅ Pode usar qualquer biblioteca nativa
- ✅ Pode publicar na App Store / Play Store
- ❌ Precisa configurar Android Studio / Xcode
- ❌ Compilação demora mais

## Quando Usar Cada Um?

- **Desenvolvimento**: Use Expo Go (mais rápido e fácil)
- **Produção**: Compile o app final (quando for publicar)

## Troubleshooting

### App não conecta ao backend
- Verifique se o IP no `.env` está correto
- Certifique-se que celular e PC estão na mesma rede Wi-Fi
- Verifique se o backend está rodando: `curl http://SEU_IP:3000/health`

### QR Code não funciona
- Certifique-se que celular e PC estão na mesma rede
- Tente usar a URL manualmente no Expo Go
- Verifique firewall do PC

### Mudanças não aparecem
- Pressione `r` no terminal para recarregar
- Feche e abra o Expo Go
- Verifique se o servidor está rodando

## Próximos Passos

1. ✅ Instalar Expo Go no celular
2. ✅ Rodar `npm run dev:mobile`
3. ✅ Escanear QR code
4. ✅ Ver o app funcionando no celular!

