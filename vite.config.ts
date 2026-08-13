import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Deploy alvo: Vercel, servido na raiz do domínio. Trocar `base` só se o site
// passar a viver num subcaminho (ex.: GitHub Pages -> '/PortfolioSites/').
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome100',
    // three.js só entra na página em telas grandes; mantê-lo fora do bundle
    // inicial é o que segura a meta de LCP < 1,5s no 4G.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    restoreMocks: true,
  },
});
