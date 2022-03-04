<template>
  <div ref="moduleContainerRef" class="module-container py-2 flex">
    <div class="max-h-full flex-grow">
      <WorldlineList class="worldline-list h-full" />
    </div>
    <div class="max-h-full">
      <CardList class="max-w-[400px] min-w-[400px] max-h-full overflow-y-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'

import WorldlineList from '~/newTab/views/worldline/List.vue'

import { useConfigState } from '~/store/config'

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

<style scoped>
/* .module-tab-pane-container {
  height: v-bind(dealTabPaneHeight);
  overflow-y: scroll;
} */

</style>
