import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800, // Increase size limit to 800kb
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks (node_modules)
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Add more manual chunks as needed based on your dependencies
        },
      },
    },
    // Additional build optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
