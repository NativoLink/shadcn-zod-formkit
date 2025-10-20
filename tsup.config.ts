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
    'react-hook-form',
    'zod',
    '@radix-ui/*',
    'lucide-react',
    'react-day-picker',
    'next-themes',
    'react-color-palette',
    'react-resizable-panels',
    'sonner'
  ],
  treeshake: true,
  minify: false, // Keep readable for debugging
  banner: {
    js: "'use client';" // If you're using Next.js client components
  }
});