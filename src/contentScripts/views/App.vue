<script setup lang="ts">
import { CONTENT_SCRIPT_COMMANDS } from '@enums/index'
import { useToggle } from '@vueuse/core'

import SearchModal from '../components/Search.vue'

const [show] = useToggle(false)

watch(show, (newValue) => {
  // eslint-disable-next-line no-console
  console.log('%c [ show ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', newValue)
})

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
        break
    }
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log('[content script] >>> onMessage error: ', e)
  }
})
</script>

<template>
  <SearchModal v-model:show="show" />
</template>
