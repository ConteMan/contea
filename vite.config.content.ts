import { defineConfig } from 'vite'
import { isDev, r } from './utils'
import { sharedConfig } from './vite.config'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  base: '/dist/',
  build: {
    watch: isDev
      ? {
        include: [
          r('src/contentScripts/**/*'),
        ],
      }
      : undefined,
    outDir: r('extension/dist/contentScripts'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/contentScripts/index.ts'),
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
