import { defineConfig } from 'vite'
import { sharedConfig } from './vite.config'
import { isDev, r } from './src/utils/script'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  base: '/dist/',
  build: {
    watch: isDev
      ? {
          include: [
            r('src/background/**/*'),
          ],
        }
      : undefined,
    outDir: r('extension/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    chunkSizeWarningLimit: 1024 * 1,
    lib: {
      entry: r('src/background/index.ts'),
      name: packageJson.name,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        extend: true,
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,
  ],
})
