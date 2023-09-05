import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js'
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://news.google.com/rss',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/geo': {
        target: `https://geolocation-db.com/json`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ip/, '')
      }
    }
  }
});
