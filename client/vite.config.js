import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js'
  },
  plugins: [react()],
  build: {
    outDir: '../server/public',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      'picocss': path.resolve(__dirname, 'node_modules/@picocss/pico/css')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001'
      },
      '/data': {
        target: 'http://localhost:3001'
      }
    }
  }
})
