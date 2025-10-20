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
    'react/jsx-runtime',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    '@radix-ui/react-accordion',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-icons',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tooltip',
    'lucide-react',
    'react-day-picker',
    'next-themes',
    'react-color-palette',
    'react-resizable-panels',
    'sonner',
    'class-variance-authority',
    'tailwind-merge',
    'input-otp'
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
  }
});