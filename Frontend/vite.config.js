import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy vendor libraries into separate cacheable chunks
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-motion': ['framer-motion'],
        }
      }
    }
  }
})
