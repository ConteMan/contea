import { dirname, relative } from 'path'
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { isDev, r } from './utils/script'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: [
      {
        find: '~/',
        replacement: `${r('src')}/`,
      },
      {
        find: '@utils/',
        replacement: `${r('utils')}/`,
      },
      {
        find: '@models/',
        replacement: `${r('models')}/`,
      },
      {
        find: '@services/',
        replacement: `${r('services')}/`,
      },
      {
        find: '@setting/',
        replacement: `${r('setting')}/`,
      },
      {
        find: '@enums/',
        replacement: `${r('enums')}/`,
      },
      {
        find: '@localTypes/',
        replacement: `${r('types')}/`,
      },
    ],
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    Vue(),
    AutoImport({
      imports: [
        'vue',
        {
          'webextension-polyfill': [['default', 'browser']],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },

    // https://github.com/antfu/unplugin-icons
    Icons(),
  ],
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'webextension-polyfill'],
    exclude: ['vue-demi'],
  },
}

export default defineConfig(({
  ...sharedConfig,
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
    ...sharedConfig.plugins!,
    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
}))
