import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { isDev, r } from './src/utils/script'
import { sharedConfig } from './vite.config'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  define: {
    '__DEV__': isDev,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
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
    Unocss({ /* options */ }),
  ],
})
