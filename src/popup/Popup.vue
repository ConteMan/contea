<template>
  <main class="w-[400px] px-4 py-5 space-y-2">
    <WakaTimeCard v-if="config.wakatime.enable" />
    <OneCard v-if="config.one.enable" />
    <V2exCard v-if="config.v2ex.enable" />
  </main>
</template>

<script setup lang="ts">
import configState from '~/models/keyValue/configState'
import { modules } from '~/setting/defaultSetting'

const data = reactive({
  config: {
    v2ex: {
      enable: false,
    },
  } as any,
})
const getConfig = async() => {
  data.config = await configState.storage.bulkSelect(modules)
}
getConfig()

const { config } = toRefs(data)
</script>
