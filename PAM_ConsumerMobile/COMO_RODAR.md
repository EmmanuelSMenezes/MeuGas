# 🚀 Como Rodar o App MeuGas

## ✅ Configurações Aplicadas

### 🎨 Identidade Visual
- ✅ Cores atualizadas: #FF6A00 (Orange Fire) e #4FC3F7 (Light Blue)
- ✅ Logo MeuGas aplicado em todos os assets
- ✅ Nome do app: MeuGas
- ✅ Package: com.meugas.app

### 🔗 APIs Configuradas
Todas as URLs apontando para produção:
- Authentication: https://api.meugas.app/authentication/
- Partner: https://api.meugas.app/partner/
- Catalog: https://api.meugas.app/catalog/
- Order: https://api.meugas.app/order/
- Communication: https://api.meugas.app/communication/
- Consumer: https://api.meugas.app/consumer/
- Logistics: https://api.meugas.app/logistics/
- Billing: https://api.meugas.app/billing/
- Offer: https://api.meugas.app/offer/
- Reputation: https://api.meugas.app/reputation/
- Storage: https://storage.meugas.app/

---

## 📱 OPÇÃO 1: Rodar no Android (Recomendado)

### Pré-requisitos:
- Android Studio instalado
- Emulador Android ou dispositivo físico conectado via USB
- USB Debugging habilitado no dispositivo

### Passos:

1. **Abra o PowerShell nesta pasta** (`PAM_ConsumerMobile`)

2. **Execute o script:**
   ```powershell
   .\run-android.ps1
   ```

3. **OU execute manualmente:**
   ```powershell
   # Instalar dependências (primeira vez)
   npm install
   
   # Iniciar Expo
   npx expo start --android
   ```

4. **Aguarde:**
   - O Metro Bundler será iniciado
   - O app será instalado e aberto automaticamente no Android
   - O JavaScript será compilado (pode demorar na primeira vez)

---

## 📲 OPÇÃO 2: Rodar com Expo Go (Mais Rápido)

### Pré-requisitos:
- Instale o app **Expo Go** no seu celular:
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://apps.apple.com/app/expo-go/id982107779)

### Passos:

1. **Inicie o Expo:**
   ```powershell
   npx expo start
   ```

2. **Escaneie o QR Code:**
   - Android: Use o app Expo Go para escanear
   - iOS: Use a câmera nativa do iPhone

3. **O app abrirá no Expo Go** com todas as configurações do MeuGas!

---

## 🏗️ OPÇÃO 3: Build de Produção (APK/AAB)

### Para gerar um APK instalável:

1. **Configure o EAS (primeira vez):**
   ```powershell
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Build de desenvolvimento:**
   ```powershell
   eas build --platform android --profile development
   ```

3. **Build de produção:**
   ```powershell
   eas build --platform android --profile production
   ```

4. **O APK/AAB será gerado** e você receberá um link para download!

---

## 🐛 Solução de Problemas

### Erro: "Cannot determine the project's Expo SDK version"
```powershell
npm install
```

### Erro: "adb: command not found"
- Certifique-se de que o Android SDK está instalado
- Adicione o ADB ao PATH:
  ```powershell
  $env:PATH += ";$env:ANDROID_HOME\platform-tools"
  ```

### Erro: "No devices found"
- Verifique se o emulador está rodando
- OU conecte um dispositivo físico via USB
- Execute: `adb devices` para verificar

### App não abre no Android
1. Feche o app
2. Execute: `npx expo start --clear`
3. Pressione 'a' para abrir no Android

---

## 📝 Arquivos Modificados

- ✅ `src/styles/theme.ts` - Cores do MeuGas
- ✅ `.env` - URLs das APIs de produção
- ✅ `app.json` - Configurações do app
- ✅ `assets/*` - Logo e ícones

---

## 🎯 Próximos Passos

1. **Teste o app** no Android
2. **Verifique** se as APIs estão respondendo
3. **Teste** o login e funcionalidades principais
4. **Gere um build** de produção quando estiver tudo OK

---

**Dúvidas?** Verifique a documentação do Expo: https://docs.expo.dev/

