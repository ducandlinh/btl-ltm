import { defineConfig } from 'vite';

export default defineConfig({
  base: '/btl-ltm/',

  server: {
    port: 5173,
    host: true,
  },

  build: {
    target: 'esnext',
  },
});