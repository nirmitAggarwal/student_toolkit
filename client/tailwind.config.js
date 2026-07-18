/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: '#F0F5F9',
        'background-dark': '#0B1120',
        foreground: '#1B2A41',
        'foreground-muted': '#526176',
        primary: '#00508F',
        'primary-dark': '#003E70',
        'primary-hover': '#0062AB',
        'primary-light': '#E8F0FE',
        secondary: '#4DB6AC',
        'secondary-dark': '#3A9D92',
        'secondary-hover': '#64C3B9',
        accent: '#C0A062',
        'accent-dark': '#A78B51',
        'accent-light': '#F5EFE0',
        surface: '#FFFFFF',
        'surface-dark': '#131B2E',
        'surface-dark-elevated': '#1A2540',
        border: '#E2E8F0',
        'border-dark': '#1E2D4A',
      },
      boxShadow: {
        glow: '0 8px 32px rgba(0, 80, 143, 0.15)',
        'glow-lg': '0 20px 60px rgba(0, 80, 143, 0.18)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 40px rgba(0, 80, 143, 0.12)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.2s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
