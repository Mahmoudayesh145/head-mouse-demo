/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
          green: '#22c55e',
          yellow: '#eab308',
        },
      },
    },
  },
  plugins: [],
}
