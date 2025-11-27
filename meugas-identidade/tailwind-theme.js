/**
 * MeuGas - Configuração TailwindCSS
 * 
 * Use este arquivo para configurar o Tailwind em qualquer projeto MeuGas
 * 
 * Exemplo de uso no tailwind.config.js:
 * 
 * const meuGasTheme = require('./meugas-identidade/tailwind-theme');
 * 
 * module.exports = {
 *   theme: {
 *     extend: meuGasTheme
 *   }
 * }
 */

module.exports = {
  colors: {
    // Cores Principais
    primary: {
      DEFAULT: '#FF6A00',
      50: '#FFE8D6',
      100: '#FFD9BD',
      200: '#FFBB8A',
      300: '#FF9D57',
      400: '#FF8424',
      500: '#FF6A00',
      600: '#CC5500',
      700: '#994000',
      800: '#662B00',
      900: '#331500',
    },
    secondary: {
      DEFAULT: '#4FC3F7',
      50: '#E1F5FE',
      100: '#B3E5FC',
      200: '#81D4FA',
      300: '#4FC3F7',
      400: '#29B6F6',
      500: '#03A9F4',
      600: '#039BE5',
      700: '#0288D1',
      800: '#0277BD',
      900: '#01579B',
    },
    // Cores de Status
    success: {
      light: '#D1FAE5',
      DEFAULT: '#10B981',
      dark: '#047857',
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#F59E0B',
      dark: '#D97706',
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#EF4444',
      dark: '#DC2626',
    },
    info: {
      light: '#DBEAFE',
      DEFAULT: '#3B82F6',
      dark: '#2563EB',
    },
  },
  
  fontFamily: {
    sans: ['Kumbh Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Urbanist', 'system-ui', 'sans-serif'],
    heading: ['Urbanist', 'system-ui', 'sans-serif'],
    body: ['Kumbh Sans', 'system-ui', 'sans-serif'],
  },
  
  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1.4' }],      // 12px
    'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
    'base': ['1rem', { lineHeight: '1.6' }],       // 16px
    'lg': ['1.125rem', { lineHeight: '1.6' }],     // 18px
    'xl': ['1.25rem', { lineHeight: '1.5' }],      // 20px
    '2xl': ['1.5rem', { lineHeight: '1.4' }],      // 24px
    '3xl': ['1.875rem', { lineHeight: '1.4' }],    // 30px
    '4xl': ['2.25rem', { lineHeight: '1.3' }],     // 36px
    '5xl': ['3rem', { lineHeight: '1.2' }],        // 48px
    '6xl': ['3.75rem', { lineHeight: '1.1' }],     // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],        // 72px
  },
  
  spacing: {
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
    '32': '128px',
    '40': '160px',
    '48': '192px',
    '56': '224px',
    '64': '256px',
  },
  
  borderRadius: {
    'none': '0',
    'sm': '4px',
    'DEFAULT': '8px',
    'md': '8px',
    'lg': '12px',
    'xl': '16px',
    '2xl': '24px',
    '3xl': '32px',
    'full': '9999px',
  },
  
  boxShadow: {
    'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.1)',
    'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
    'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
    'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    'primary': '0 4px 14px rgba(255, 106, 0, 0.3)',
    'primary-lg': '0 10px 24px rgba(255, 106, 0, 0.4)',
    'secondary': '0 4px 14px rgba(79, 195, 247, 0.3)',
    'secondary-lg': '0 10px 24px rgba(79, 195, 247, 0.4)',
    'none': 'none',
  },
  
  animation: {
    'fade-in': 'fadeIn 0.6s ease-in-out',
    'fade-in-up': 'fadeInUp 0.6s ease-out',
    'fade-in-down': 'fadeInDown 0.6s ease-out',
    'slide-up': 'slideUp 0.6s ease-out',
    'slide-down': 'slideDown 0.6s ease-out',
    'slide-left': 'slideLeft 0.6s ease-out',
    'slide-right': 'slideRight 0.6s ease-out',
    'bounce-slow': 'bounce 3s infinite',
    'pulse-slow': 'pulse 3s infinite',
    'spin-slow': 'spin 3s linear infinite',
  },
  
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeInUp: {
      '0%': { opacity: '0', transform: 'translateY(20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    fadeInDown: {
      '0%': { opacity: '0', transform: 'translateY(-20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideUp: {
      '0%': { transform: 'translateY(100%)' },
      '100%': { transform: 'translateY(0)' },
    },
  },
}

