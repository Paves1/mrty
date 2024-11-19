import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'date-vendor': ['date-fns', 'react-day-picker'],
          'router-vendor': ['react-router-dom'],
          'state-vendor': ['zustand']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'date-fns', 'react-day-picker', 'react-router-dom', 'zustand']
  }
});