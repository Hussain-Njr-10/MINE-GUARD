/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mine: {
          dark: '#0f172a',    // slate-900 for background
          panel: '#1e293b',   // slate-800 for panels
          border: '#334155',  // slate-700 for subtle borders
          text: '#f8fafc',    // slate-50
          muted: '#94a3b8',   // slate-400
        },
        semantic: {
          green: '#10b981',   // emerald-500
          greenDark: '#059669',
          amber: '#f59e0b',   // amber-500
          amberDark: '#d97706',
          red: '#ef4444',     // red-500
          redDark: '#dc2626',
          cyan: '#06b6d4',    // cyan-500
          cyanDark: '#0891b2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
