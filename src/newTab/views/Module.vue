<template>
  <div ref="moduleContainerRef" class="module-container h-screen flex flex-col overflow-y-hidden">
    <TopBar ref="moduleTabRef" />

    <div class="flex flex-grow" :style="{ 'max-height': data.dealTabPaneHeight }">
      <div class="flex-grow max-h-full pb-2">
        <WorldlineList class="worldline-list h-full" />
      </div>
      <div class="max-h-full pb-2">
        <CardList class="max-w-[400px] min-w-[400px] max-h-full overflow-y-auto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'css-doodle'
import { useElementBounding } from '@vueuse/core'
import { useConfigState } from '~/store/config'

import WorldlineList from '~/newTab/views/worldline/List.vue'
import TopBar from '~/components/layout/TopBar.vue'

const data = reactive({
  config: {} as any,
  moduleContainerRef: null,
  moduleTabRef: null,
  dealTabPaneHeight: '',
})

const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all

const { moduleContainerRef, moduleTabRef } = toRefs(data)
const { height: containerHeight } = useElementBounding(moduleContainerRef)
const { height: tabHeight } = useElementBounding(moduleTabRef)
data.dealTabPaneHeight = `${containerHeight.value - tabHeight.value}px`

watch([containerHeight, tabHeight], () => {
  data.dealTabPaneHeight = `${containerHeight.value - tabHeight.value}px`
})
</script>
