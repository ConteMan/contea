<template>
  <div class="w-full h-screen bg-center bg-cover" :style="data.wallpaperStyle">
    <div class="zen-setting-container fixed bottom-1 right-2 space-x-2 rounded-md pt-2 px-2 hover:(bg-light-400)" :class="{ '!bg-light-400': settingBg }">
      <la-random v-if="wallpaperInfo.mode === 'random'" class="opacity-30 cursor-pointer hover:(opacity-100)" @click="random()" />
      <n-popover
        trigger="hover"
        raw
        display-directive="if"
        placement="top"
        :to="false"
        :show-arrow="false"
        :overlap="false"
        :duration="300"
      >
        <template #trigger>
          <mdi-opacity
            class="opacity-30 cursor-pointer hover:(opacity-100)"
            :class="{ '!opacity-100': showOpacity }"
          />
        </template>
        <div
          ref="popover"
          class="h-[200px] mb-[10px]"
          @mouseover="showSettingBg()"
          @mouseout="showSettingBg(false)"
        >
          <n-slider
            v-model:value="data.backgroundOpacity"
            class="zen-opacity-slider bg-light-400"
            vertical
            :format-tooltip="value => `${value}%`"
          />
        </div>
      </n-popover>
      <mdi-pin-off-outline v-if="wallpaperInfo.mode === 'random'" class="opacity-30 cursor-pointer hover:(opacity-100)" @click="changeMode()" />
      <mdi-pin v-else class="opacity-30 cursor-pointer hover:(opacity-100)" @click="changeMode()" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useNewTabState } from '~/store/newTab'

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
  backgroundOpacity: 0,
  settingBg: false, // 设置栏背景显隐
  showOpacity: false, // Opacity 按钮显隐
})
const { wallpaperInfo, backgroundOpacity, settingBg, showOpacity } = toRefs(data)
const popover = ref(null)

const newTabState = useNewTabState()
const { wallpaper } = storeToRefs(newTabState)
data.wallpaperInfo = wallpaper

const init = async() => {
  if (data.wallpaperInfo.mode === 'random') {
    await newTabState.changeWallpaper()
  }
  else {
    if (data.wallpaperInfo.url) {
      data.backgroundOpacity = data.wallpaperInfo.opacity
      data.wallpaperStyle = {
        'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${data.wallpaperInfo.url}), ${data.wallpaperInfo.opacity}%)`,
      }
    }
  }
}
init()

const random = async() => {
  await newTabState.changeWallpaper()
}

const changeMode = async() => {
  newTabState.changeWallpaperMode()
}

watch([wallpaperInfo], ([newWallpaperInfo]) => {
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${newWallpaperInfo.url}), ${newWallpaperInfo.opacity}%)`,
  }
})

watch(backgroundOpacity, (newValue) => {
  newTabState.changeWallpaperOpcity(newValue)
})

const showSettingBg = (show = true) => {
  if (show) {
    data.settingBg = true
  }
  else {
    if (!data.showOpacity)
      data.settingBg = false
  }
}

watch(popover, (newValue) => {
  data.showOpacity = !!newValue
  data.settingBg = !!newValue
})
</script>
<style lang="less">
.zen-opacity-slider {
  border-radius: 1.5rem;
}
</style>
