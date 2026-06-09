import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  css: {
    // Use an empty postcss config during tests to avoid the
    // "tailwindcss used directly as PostCSS plugin" crash from
    // third-party CSS files (e.g. react-color-palette).
    postcss: {},
  },
  test: {
    environment: 'jsdom',
    globals: true,
    css: false,
  },
});
