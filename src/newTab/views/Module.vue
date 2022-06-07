<template>
  <div
    ref="moduleContainerRef"
    class="module-container h-screen flex flex-col overflow-y-hidden bg-cover p-[8px] pt-[16px]"
    :style="data.wallpaperStyle"
  >
    <div class="flex flex-grow" :style="{ 'max-height': data.dealTabPaneHeight }">
      <div class="flex-grow max-h-full pb-2">
        <WorldlineList class="worldline-list h-full" />
      </div>
      <!-- <div class="max-h-full pb-2">
        <CardList class="max-w-[400px] min-w-[400px] max-h-full overflow-y-auto" />
      </div> -->
    </div>

    <ActionBar ref="moduleTabRef" />
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useConfigState } from '~/store/config'
import { useNewTabState } from '~/store/newTab'

import WorldlineList from '~/newTab/views/worldline/List.vue'
import ActionBar from '~/components/layout/ActionBar.vue'

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
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
data.dealTabPaneHeight = `${containerHeight.value - tabHeight.value - 16}px`

watch([containerHeight, tabHeight], () => {
  data.dealTabPaneHeight = `${containerHeight.value - tabHeight.value - 16}px`
})

const newTabState = useNewTabState()
const { wallpaper } = storeToRefs(newTabState)
data.wallpaperInfo = wallpaper

const init = async() => {
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
