<template>
  <div class="p-4 flex justify-between min-w-full shadow-md rounded-md bg-gradient-to-br from-red-500">
    <div class="flex items-center">
      <mdi-code-braces-box />
      <span class="ml-2">{{ info.cummulative_total.text }}</span>
    </div>
    <div class="relative flex items-center text-right">
      <div
        class="cursor-pointer text-2xl text-white hover:(text-gray-400)"
        @click.stop="openSite('https://wakatime.com')"
      >
        WakaTime
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import WakaTime from '~/services/wakatime'
import { openSite } from '~/utils'

interface Info {
  cummulative_total: {
    text: string
  }
  [other: string]: any
}

const info: UnwrapRef<Info> = reactive({
  cummulative_total: {
    text: '',
  },
})

const getInfo = async() => {
  const res = await WakaTime.daySummary()
  info.cummulative_total = res.cummulative_total
}

getInfo()
</script>
