import { defineConfig } from 'vite'
import { isDev, r } from './utils'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  base: '/dist/',
  root: r('src'),
  // resolve: {
  //   alias: [
  //     {
  //       find: '~/',
  //       replacement: `${r('src')}/`,
  //     },
  //   ],
  // },
  define: {
    __DEV__: isDev,
  },
  build: {
    watch: isDev
      ? {
        include: [
          r('src/background/**/*'),
        ],
      }
      : undefined,
    outDir: isDev ? r('extension/dist/background') : r('extension_build/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
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
  ],
})
