import { resolve } from 'node:path'
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  // https://windicss.org/posts/v30.html#attributify-mode
  attributify: true,
  extract: {
    include: [
      resolve(__dirname, 'src/**/*.{vue,html}'),
    ],
  },
  theme: {
    container: {
      center: true,
    },
  },
  shortcuts: {
    'btn-active': '!text-red-600',
    'word-keep-all': {
      'word-break': 'keep-all',
    },
  },
})
