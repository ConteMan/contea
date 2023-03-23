<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useNewTabState } from '@newTab/store/index'

import List from '@newTab/views/board/List.vue'
// import Card from '@newTab/views/card/Card.vue'
import ActionBar from '@newTab/components/layout/ActionBar.vue'

// 容器样式：背景
const NewTabStore = useNewTabState()
const { wallpaper } = storeToRefs(NewTabStore)
const containerStyle = computed(() => {
  if (!wallpaper.value.url)
    return {}

  return {
    'background-image':
      `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==),
      url(${wallpaper.value.url}),
      ${wallpaper.value.opacity ?? 100}%)`,
  }
})

// 内容样式：高度
const containerRef = ref(null)
const { height } = useElementBounding(containerRef)
const contentStyle = computed(() => {
  return {
    height: `${height.value}px`,
  }
})

// 判断布局模式
const layoutMode = (mode: 'list' | 'card') => {
  return mode === NewTabStore.layoutMode
}
</script>

<template>
  <div
    ref="containerRef"
    class="index-container w-full h-full fixed bg-cover"
    :style="containerStyle"
  >
    <div class="w-full" :style="contentStyle">
      <List v-if="layoutMode('list')" class="h-full w-full" />
      <!-- <Card v-if="layoutMode('card')" class="w-full h-full flex justify-center items-center" /> -->
    </div>

    <ActionBar />
  </div>
</template>
