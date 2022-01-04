<template>
  <div>
    <div> WakaTime</div>
    <div>今天已经 Coding {{ info.cummulative_total.text }}</div>
  </div>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import WakaTime from '~/services/wakatime'

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
