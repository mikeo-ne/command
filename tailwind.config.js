/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        m1: {
          bg: '#07090E',
          card: '#0F131D',
          border: '#1E2638',
          hover: '#171D2C',
          cyan: '#00F0FF',
          cyanGlow: 'rgba(0, 240, 255, 0.2)',
          gold: '#FFB800',
          goldGlow: 'rgba(255, 184, 0, 0.2)',
          purple: '#A855F7',
          emerald: '#10B981',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
