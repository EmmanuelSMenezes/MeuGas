/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        sans: ['Kumbh Sans', 'system-ui', 'sans-serif'],
        display: ['Urbanist', 'system-ui', 'sans-serif'],
        heading: ['Urbanist', 'system-ui', 'sans-serif'],
        body: ['Kumbh Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

