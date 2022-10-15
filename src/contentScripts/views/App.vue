<script setup lang="ts">
import { CONTENT_SCRIPT_COMMANDS } from '@enums/index'
import { usePreferredDark, useToggle } from '@vueuse/core'
import 'virtual:windi.css'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui'

const [show, toggle] = useToggle(false)

browser.runtime.onMessage.addListener(async (message: Message.RuntimeMessage, sender: any) => {
  // eslint-disable-next-line no-console
  console.log(`${new Date()} [content script] 收到 [${sender.id}] 发来的信息：${JSON.stringify(message)}`)
  try {
    const { type, name = '', tabId = '' } = message
    switch (type) {
      case CONTENT_SCRIPT_COMMANDS.SHOW: {
        show.value = !show.value
        return true
      }
      default:
        return true
    }
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log('[content script] >>> onMessage error: ', e)
  }
})

const data = reactive({
  namespace: 'contea-namespace',
})
const { namespace } = toRefs(data)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ff4f49',
    primaryColorHover: '#fd2720',
  },
  Input: {
    borderHover: '#fff',
    borderFocus: '#fff',
    boxShadowFocus: '#fff',
    caretColor: '#e5e5e5',
  },
  Switch: {
    boxShadowFocus: '#fff',
  },
}

const isPreferredDark = usePreferredDark()
const theme = computed(() => {
  return isPreferredDark.value ? darkTheme : null
})
</script>

<template>
  <NConfigProvider
    class="config-container"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :namespace="namespace"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <div class="fixed right-4 bottom-0 m-5 z-100 flex font-sans select-none leading-1em">
      <div
        class="flex w-10 h-10 rounded-full shadow cursor-pointer"
        bg="teal-600 hover:teal-700"
        @click="toggle()"
      >
        <pixelarticons-power class="block m-auto text-white text-lg" />
      </div>
    </div>

    <n-drawer
      v-model:show="show"
      placement="left"
      width="500px"
      :auto-focus="false"
    >
      <div class="h-full w-full flex justify-center items-center">
        Hello World
      </div>
    </n-drawer>
    <n-global-style />
  </NConfigProvider>
</template>
