import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api' : {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // ✅ Vitest configuration added below
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Make sure this file exists in src/
  }
})