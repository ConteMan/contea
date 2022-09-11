<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useConfigState } from '@newTab/store/config'
import { useNewTabState } from '@newTab/store/newTab'

import List from '@newTab/views/worldline/List.vue'
import Card from '@newTab/views/card/Card.vue'
import ActionBar from '@newTab/components/layout/ActionBar.vue'

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
  config: {} as any,
  moduleContainerRef: null,
  dealTabPaneHeight: '',
})

const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all

const { moduleContainerRef } = toRefs(data)
const { height: containerHeight } = useElementBounding(moduleContainerRef)
data.dealTabPaneHeight = `${containerHeight.value}px`

watch([containerHeight], () => {
  data.dealTabPaneHeight = `${containerHeight.value}px`
})

const newTabState = useNewTabState()
const { wallpaper } = storeToRefs(newTabState)
data.wallpaperInfo = wallpaper

const init = async () => {
  if (data.wallpaperInfo.url) {
    data.wallpaperStyle = {
      'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${data.wallpaperInfo.url}), ${data.wallpaperInfo.opacity}%)`,
    }
  }
}
init()

watch(() => data.wallpaperInfo, (newWallpaperInfo) => {
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${newWallpaperInfo.url}), ${newWallpaperInfo.opacity}%)`,
  }
}, { deep: true })
</script>

<template>
  <div
    ref="moduleContainerRef"
    class="module-container fixed h-full w-full bg-cover"
    :style="data.wallpaperStyle"
  >
    <div class="flex flex-grow" :style="{ height: data.dealTabPaneHeight }">
      <div
        v-if="newTabState.layoutMode === 'list'"
        class="flex-grow max-h-full py-2"
      >
        <List class="worldline-list h-full" />
      </div>
      <div
        v-if="newTabState.layoutMode === 'card'"
        class="w-full h-full flex justify-center items-center"
      >
        <Card />
      </div>
    </div>

    <ActionBar />
  </div>
</template>
