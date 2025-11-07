import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,  // Port React (default Vite)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // Port Express
        changeOrigin: true,
        secure: false,
      },
    },
  },
})