# 🔥 MeuGas - Landing Page

Landing page moderna e responsiva para o aplicativo MeuGas, concorrente do Chama.

## 🎨 Identidade Visual

- **Cor Principal:** Laranja Fogo (#FF6A00)
- **Cor Secundária:** Azul Claro (#4FC3F7)
- **Tipografia:** Inter (Google Fonts)
- **Estilo:** Moderno, limpo, focado em conversão

## 🚀 Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Ícones:** React Icons
- **Animações:** Framer Motion

## 📦 Instalação

```bash
# Instalar dependências
npm install
# ou
yarn install

# Rodar em desenvolvimento
npm run dev
# ou
yarn dev

# Build para produção
npm run build
# ou
yarn build

# Rodar produção
npm start
# ou
yarn start
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📂 Estrutura do Projeto

```
LandingPage/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos globais
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página inicial
│   └── components/
│       ├── Header.tsx           # Cabeçalho fixo
│       ├── Hero.tsx             # Seção hero
│       ├── HowItWorks.tsx       # Como funciona
│       ├── Benefits.tsx         # Benefícios
│       ├── ForPartners.tsx      # Seção para parceiros
│       ├── AppDownload.tsx      # Download do app
│       └── Footer.tsx           # Rodapé
├── public/                      # Assets estáticos
├── tailwind.config.js           # Configuração Tailwind
├── next.config.js               # Configuração Next.js
└── package.json
```

## 🎯 Seções da Landing Page

### 1. **Header (Cabeçalho Fixo)**
- Logo MeuGas
- Menu de navegação
- Botões CTA (Baixar App + Portal do Parceiro)
- Menu mobile responsivo

### 2. **Hero (Topo)**
- Título impactante
- Subtítulo explicativo
- Botões de download (Android + iOS)
- Botão secundário (Portal do Parceiro)
- Estatísticas (1000+ entregas, 50+ parceiros, 4.8★)
- Mockup do app (placeholder)

### 3. **Como Funciona**
- 3 passos simples
- Ícones ilustrativos
- Cards com hover effects
- CTA "Começar Agora"

### 4. **Benefícios**
- 6 cards de benefícios
- Ícones coloridos
- Indicadores de confiança
- Estatísticas (100% seguro, 24/7 suporte, etc.)

### 5. **Para Parceiros**
- Seção com fundo azul claro
- Lista de benefícios para distribuidoras
- Dashboard mockup
- CTAs (Portal do Parceiro + Falar com Especialista)

### 6. **Download do App**
- Seção com gradiente laranja
- Botões grandes para App Store e Google Play
- QR Code (placeholder)
- Estatísticas do app

### 7. **Footer (Rodapé)**
- Logo e descrição
- Links rápidos
- Links legais
- Informações de contato
- Redes sociais
- Copyright

## 🎨 Customização

### Cores

Edite `tailwind.config.js` para ajustar as cores:

```javascript
colors: {
  primary: {
    DEFAULT: '#FF6A00',  // Laranja Fogo
    // ...
  },
  secondary: {
    DEFAULT: '#4FC3F7',  // Azul Claro
    // ...
  },
}
```

### Conteúdo

Edite os componentes em `src/components/` para alterar textos, links e imagens.

### Imagens

Substitua os placeholders por imagens reais:
- Mockup do app no Hero
- Mockup do app no AppDownload
- QR Code no AppDownload

## 🔗 Links Importantes

- **Portal do Parceiro:** http://parceiro.meugas.app
- **Portal Admin:** http://administrador.meugas.app
- **API:** http://api.meugas.app

## 📱 Responsividade

A landing page é totalmente responsiva:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## ⚡ Performance

- Otimização de imagens com Next.js Image
- Lazy loading de componentes
- CSS otimizado com TailwindCSS
- Build otimizado para produção

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t meugas-landing .

# Run
docker run -p 3000:3000 meugas-landing
```

### Kubernetes

Use os manifestos em `k8s/` para deploy no cluster.

## 📝 TODO

- [ ] Adicionar imagens reais do app
- [ ] Gerar QR Code real
- [ ] Adicionar Google Analytics
- [ ] Adicionar Facebook Pixel
- [ ] Implementar formulário de contato
- [ ] Adicionar chat ao vivo
- [ ] Criar páginas de Termos e Privacidade
- [ ] Adicionar SEO avançado
- [ ] Implementar testes E2E

## 📄 Licença

© 2024 MeuGas. Todos os direitos reservados.

