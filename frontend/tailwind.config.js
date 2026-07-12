/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617',
          900: '#0f172a',
          800: '#111827',
          700: '#1e293b',
          600: '#334155',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f8fafc',
        },
        aurora: {
          500: '#38bdf8',
          400: '#60a5fa',
          300: '#93c5fd',
        },
        violet: {
          500: '#8b5cf6',
          400: '#a78bfa',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96, 165, 250, 0.15), 0 8px 30px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
