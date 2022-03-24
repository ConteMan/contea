import { dirname, relative } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { isDev, r } from './utils'

export default defineConfig(({
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
    outDir: r('extension/dist'),
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
        newTab: r('src/newTab/index.html'),
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
