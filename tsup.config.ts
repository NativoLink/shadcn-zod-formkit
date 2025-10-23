import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
  ],
  treeshake: true, 
  minify: false,
  banner: {
    js: "'use client';"
  },
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs'
    }
  },
  // ✅ permite importar CSS dentro de TS/JS
  loader: {
    ".css": "css",
  }
});