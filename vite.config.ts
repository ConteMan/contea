import { dirname, relative } from 'path'
import { defineConfig, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import styleImport, { AndDesignVueResolve } from 'vite-plugin-style-import'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { r, port, isDev } from './scripts/utils'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: [
      {
        find: '~/',
        replacement: `${r('src')}/`,
      },
      {
        find: '#/',
        replacement: `${r('types')}/`,
      },
      {
        find: '~o/',
        replacement: `${r('src/options')}/`,
      },
      {
        find: 'node-fetch',
        replacement: 'isomorphic-fetch',
      },
    ],
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    Vue(),
    // https://github.com/vbenjs/vite-plugin-vue-setup-extend
    VueSetupExtend(),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'webextension-polyfill': [['default', 'browser']],
          'dayjs': [['default', 'dayjs']],
          'naive-ui': ['useNotification'],
          'pinia': ['storeToRefs'],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),

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
        AntDesignVueResolver({
          resolveIcons: true,
          importLess: true,
        }),
        NaiveUiResolver(),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },

    // https://github.com/anncwb/vite-plugin-style-import
    styleImport({
      resolves: [
        AndDesignVueResolve(),
      ],
      libs: [
        // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          },
        },
      ],
    }),
  ],
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'webextension-polyfill'],
    exclude: ['vue-demi'],
  },
  // https://github.com/anncwb/vite-plugin-style-import
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

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
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
        background: r('src/background/index.html'),
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
