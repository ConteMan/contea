import { dirname, relative } from 'path'
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { isDev, r } from './src/utils/script'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: [
      {
        find: 'node-fetch',
        replacement: 'isomorphic-fetch',
      },
      {
        find: '~/',
        replacement: `${r('src')}/`,
      },
      {
        find: '@newTab/',
        replacement: `${r('src/newTab')}/`,
      },
      {
        find: '@styles/',
        replacement: `${r('src/styles')}/`,
      },
      {
        find: '@utils/',
        replacement: `${r('src/utils')}/`,
      },
      {
        find: '@models/',
        replacement: `${r('src/models')}/`,
      },
      {
        find: '@services/',
        replacement: `${r('src/services')}/`,
      },
      {
        find: '@setting/',
        replacement: `${r('src/setting')}/`,
      },
      {
        find: '@enums/',
        replacement: `${r('src/enums')}/`,
      },
      {
        find: '@localTypes/',
        replacement: `${r('src/types')}/`,
      },
    ],
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    Vue({
      reactivityTransform: true, // 响应性语法糖
      // template: {
      //   compilerOptions: {
      //     // 跳过标签解析
      //     isCustomElement: tag => tag === 'xxx',
      //   },
      // },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/head',
        {
          'webextension-polyfill': [
            ['*', 'browser'],
          ],
          'naive-ui': ['useNotification'],
          'pinia': ['storeToRefs'],
          'dayjs': [['default', 'dayjs']],
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

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [
        r('src/components'),
      ],
      // generate `components.d.ts` for ts support with Volar
      dts: true,
      resolvers: [
        // auto import icons
        IconsResolver({
          componentPrefix: '',
        }),
        NaiveUiResolver(),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),
  ],
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'webextension-polyfill'],
    exclude: ['vue-demi'],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${r('src/styles/contea.less')}";`, // src/css/common.less 是你需要全局变量 （你定义的定义的方法 和 变量等）
        },
        javascriptEnabled: true,
      },
    },
  },
}

export default defineConfig(({
  ...sharedConfig,
  base: '/dist/',
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    chunkSizeWarningLimit: 1024 * 4,
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
