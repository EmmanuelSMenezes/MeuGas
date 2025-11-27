# 🎨 MeuGas - Identidade Visual

Guia completo de identidade visual do MeuGas para uso em todos os produtos (Landing Page, Admin Web, Partner Web, Consumer Mobile).

---

## 🎯 Conceito da Marca

**MeuGas** é um aplicativo moderno de delivery de gás que conecta consumidores a distribuidoras verificadas, oferecendo:
- Rapidez e praticidade
- Transparência de preços
- Segurança e rastreamento
- Economia para o consumidor

---

## 🎨 Paleta de Cores

### Cores Principais

#### Laranja Fogo (Primary)
**Uso:** CTAs principais, destaques, botões de ação, ícones importantes

```css
--primary-50:  #FFE8D6
--primary-100: #FFD9BD
--primary-200: #FFBB8A
--primary-300: #FF9D57
--primary-400: #FF8424
--primary-500: #FF6A00  /* COR PRINCIPAL */
--primary-600: #CC5500
--primary-700: #994000
--primary-800: #662B00
--primary-900: #331500
```

**HEX Principal:** `#FF6A00`  
**RGB:** `rgb(255, 106, 0)`  
**HSL:** `hsl(25, 100%, 50%)`

---

#### Azul Claro (Secondary)
**Uso:** Links, informações secundárias, seção de parceiros, elementos de suporte

```css
--secondary-50:  #E1F5FE
--secondary-100: #B3E5FC
--secondary-200: #81D4FA
--secondary-300: #4FC3F7  /* COR SECUNDÁRIA */
--secondary-400: #29B6F6
--secondary-500: #03A9F4
--secondary-600: #039BE5
--secondary-700: #0288D1
--secondary-800: #0277BD
--secondary-900: #01579B
```

**HEX Principal:** `#4FC3F7`  
**RGB:** `rgb(79, 195, 247)`  
**HSL:** `hsl(199, 92%, 64%)`

---

### Cores Neutras

```css
--gray-50:  #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
```

---

### Cores de Status

```css
--success: #10B981  /* Verde - Pedido confirmado */
--warning: #F59E0B  /* Amarelo - Aguardando */
--error:   #EF4444  /* Vermelho - Erro/Cancelado */
--info:    #3B82F6  /* Azul - Informação */
```

---

## 📐 Tipografia

### Fontes Oficiais

#### Fonte Principal: **Urbanist**
Usada para títulos, headings e elementos de destaque.

```html
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

#### Fonte Secundária: **Kumbh Sans**
Usada para corpo de texto, parágrafos e elementos secundários.

```html
<link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Hierarquia de Texto

```css
/* Títulos - Urbanist */
h1: 48px / 3rem    - font-family: Urbanist - font-weight: 800 - line-height: 1.2
h2: 36px / 2.25rem - font-family: Urbanist - font-weight: 700 - line-height: 1.3
h3: 30px / 1.875rem - font-family: Urbanist - font-weight: 700 - line-height: 1.4
h4: 24px / 1.5rem  - font-family: Urbanist - font-weight: 600 - line-height: 1.4
h5: 20px / 1.25rem - font-family: Urbanist - font-weight: 600 - line-height: 1.5
h6: 18px / 1.125rem - font-family: Urbanist - font-weight: 600 - line-height: 1.5

/* Corpo - Kumbh Sans */
body:     16px / 1rem    - font-family: Kumbh Sans - font-weight: 400 - line-height: 1.6
body-lg:  18px / 1.125rem - font-family: Kumbh Sans - font-weight: 400 - line-height: 1.6
body-sm:  14px / 0.875rem - font-family: Kumbh Sans - font-weight: 400 - line-height: 1.5
caption:  12px / 0.75rem  - font-family: Kumbh Sans - font-weight: 400 - line-height: 1.4
```

---

## 🎭 Logo

### Versões Disponíveis

O logo do MeuGas está disponível em 4 versões:

1. **Logo Azul e Laranja** (Principal)
   - Uso: Fundos brancos ou claros
   - Formato: SVG, PNG, PDF, EPS, JPG
   - Localização: `Logo/`

2. **Logo Branco e Laranja**
   - Uso: Fundos escuros ou coloridos
   - Formato: SVG, PNG, PDF, EPS, JPG
   - Localização: `Logo/`

3. **Logo Monocromático Branco**
   - Uso: Fundos escuros, aplicações especiais
   - Formato: SVG, PNG, PDF, EPS, JPG
   - Localização: `Logo/`

4. **Logo Monocromático Preto**
   - Uso: Impressões P&B, aplicações especiais
   - Formato: SVG, PNG, PDF, EPS, JPG
   - Localização: `Logo/`

### Símbolo (Ícone)

O símbolo isolado do MeuGas também está disponível em todas as versões:
- Localização: `Símbolo/`
- Formatos: SVG, PNG, PDF, EPS, JPG

### Área de Proteção

Mantenha sempre um espaço mínimo ao redor do logo equivalente à altura da letra "M" do logotipo.

### Tamanho Mínimo

- **Digital:** 120px de largura
- **Impresso:** 30mm de largura

### Uso Correto

✅ Use sempre os arquivos vetoriais (SVG, EPS) quando possível
✅ Mantenha as proporções originais
✅ Use a versão correta para cada fundo
✅ Respeite a área de proteção

❌ Não altere as cores
❌ Não distorça ou rotacione
❌ Não adicione efeitos (sombra, brilho, etc.)
❌ Não use em fundos que comprometam a legibilidade

---

## 🔘 Componentes

### Botões

#### Botão Primário (Laranja)
```css
background: #FF6A00
color: #FFFFFF
padding: 12px 32px
border-radius: 8px
font-weight: 600
box-shadow: 0 4px 6px rgba(255, 106, 0, 0.3)

hover:
  background: #CC5500
  transform: translateY(-2px)
  box-shadow: 0 6px 12px rgba(255, 106, 0, 0.4)
```

#### Botão Secundário (Azul)
```css
background: #4FC3F7
color: #FFFFFF
padding: 12px 32px
border-radius: 8px
font-weight: 600
box-shadow: 0 4px 6px rgba(79, 195, 247, 0.3)

hover:
  background: #29B6F6
  transform: translateY(-2px)
```

#### Botão Outline
```css
background: transparent
border: 2px solid #FF6A00
color: #FF6A00
padding: 12px 32px
border-radius: 8px
font-weight: 600

hover:
  background: #FF6A00
  color: #FFFFFF
```

---

## 📱 Ícones

**Biblioteca recomendada:** React Icons (react-icons)

### Ícones Principais

```javascript
import { 
  FaFire,           // Logo/Fogo (representa rapidez)
  FaShoppingCart,   // Pedido
  FaTruck,          // Entrega
  FaMapMarkerAlt,   // Localização
  FaShieldAlt,      // Segurança
  FaDollarSign,     // Preço
  FaClock,          // Tempo
  FaCheckCircle,    // Confirmação
  FaStore,          // Parceiro
  FaMobileAlt,      // App Mobile
} from 'react-icons/fa';
```

**Tamanhos:**
- Pequeno: 16px
- Médio: 24px
- Grande: 32px
- Extra Grande: 48px

---

## 🖼️ Imagens e Ilustrações

### Estilo Visual
- **Fotos:** Realistas, com pessoas felizes recebendo gás
- **Ilustrações:** Flat design, cores vibrantes (laranja e azul)
- **Mockups:** Smartphones com telas do app

### Fontes Recomendadas
- Unsplash (fotos gratuitas)
- unDraw (ilustrações customizáveis)
- Figma Community (mockups)

---

## 📏 Espaçamento

Sistema baseado em múltiplos de 4px:

```css
--spacing-1:  4px
--spacing-2:  8px
--spacing-3:  12px
--spacing-4:  16px
--spacing-5:  20px
--spacing-6:  24px
--spacing-8:  32px
--spacing-10: 40px
--spacing-12: 48px
--spacing-16: 64px
--spacing-20: 80px
--spacing-24: 96px
```

---

## 🎭 Sombras

```css
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.15)
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

---

## 📐 Border Radius

```css
--radius-sm:  4px   /* Inputs, tags */
--radius-md:  8px   /* Botões, cards */
--radius-lg:  12px  /* Cards grandes */
--radius-xl:  16px  /* Modais */
--radius-2xl: 24px  /* Seções especiais */
--radius-full: 9999px /* Badges, avatares */
```


