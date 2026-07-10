export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#2563EB',
        accent: '#60A5FA',
        background: '#F8FAFC',
        dark: '#0F172A',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(29, 78, 216, 0.18)',
      },
    },
  },
  plugins: [],
};
