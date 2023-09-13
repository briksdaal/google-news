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
      '/api/topics/business': {
        target:
          'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/topics\/business/, '')
      },
      '/api/topics/technology': {
        target:
          'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/topics\/technology/, '')
      },
      '/api/topics/entertainment': {
        target:
          'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/topics\/entertainment/, '')
      },
      '/api/topics/sports': {
        target:
          'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/topics\/sports/, '')
      },
      '/api/topics/science': {
        target:
          'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/topics\/science/, '')
      },
      '/api/topics/health': {
        target:
          'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/topics\/health/, '')
      },
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
