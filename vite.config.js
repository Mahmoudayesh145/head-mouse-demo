import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/head-mouse-demo/',
  server: {
    host: true,
  },
})
