import { dirname, relative } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { isDev, port, r } from './utils'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  root: r('src'),
  resolve: {
    alias: [
      {
        find: '~/',
        replacement: `${r('src')}/`,
      },
    ],
  },
  define: {
    __DEV__: isDev,
  },
  build: {
    outDir: isDev ? r('extension/dist') : r('extension_build/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
  plugins: [
    Vue(),
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },
  ],
}))
