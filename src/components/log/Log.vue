<template>
  <div class="fixed bottom-0 w-full" :class="showLogWindow ? 'max-h-[30%] bg-light-900' : 'h-4'">
    <div class="w-full flex justify-center opacity-20 cursor-pointer hover:(opacity-100)" @click="newTabState.changeLogWindow()">
      <mdi-chevron-down v-if="showLogWindow" class="text-gray-400" />
      <mdi-chevron-up v-else class="text-gray-400" />
    </div>
    <n-log
      v-if="showLogWindow"
      ref="logInst"
      class="break-all p-2"
      language="naive-log"
      :hljs="hljs"
      :log="data.dealLog"
    />
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import type { LogInst } from 'naive-ui'
import { isObject } from '@utils/is'
import { useNewTabState } from '~/store/newTab'

const logInst = ref<LogInst|null>(null)

const data = reactive({
  dealLog: '' as any,
})

const newTabState = useNewTabState()
const { log, showLogWindow } = storeToRefs(newTabState)

watch(log, (newVal: any) => {
  data.dealLog += isObject(newVal) ? `${JSON.stringify(newVal, null, 2)}\n` : `${String(newVal)}\n`
  if (data.dealLog.length > 10000)
    data.dealLog = data.dealLog.slice(data.dealLog.length - 10000)

  nextTick(() => {
    logInst.value?.scrollTo({ position: 'bottom', slient: true })
  })
})
</script>
