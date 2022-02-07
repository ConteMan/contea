<template>
  <div class="w-full h-screen bg-center bg-cover" :style="data.wallpaperStyle">
    <div class="zen-setting-container fixed bottom-1 right-2 space-x-2 rounded-md pt-2 px-2 hover:(bg-light-400)" :class="{ 'bg-light-400': settingBg }">
      <la-random v-if="wallpaperInfo.mode === 'random'" class="opacity-30 cursor-pointer hover:(opacity-100)" @click="random()" />
      <n-popover
        trigger="hover"
        raw
        display-directive="if"
        placement="top"
        :to="false"
        :show-arrow="false"
        :overlap="false"
      >
        <template #trigger>
          <mdi-opacity
            class="opacity-30 cursor-pointer hover:(opacity-100)"
            :class="{ '!opacity-100': showOpacity }"
          />
        </template>
        <div
          ref="popover"
          class="h-[200px]"
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
  settingBg: false,
  showOpacity: false,
})
const { wallpaperInfo, backgroundOpacity, settingBg, showOpacity } = toRefs(data)
const popover = ref(null)

const newTabState = useNewTabState()
const { wallpaper } = storeToRefs(newTabState)
data.wallpaperInfo = wallpaper
if (wallpaper.value.url) {
  data.backgroundOpacity = wallpaper.value.opacity
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${wallpaper.value.url}), ${data.backgroundOpacity}%)`,
  }
}

const init = async() => {
  if (data.wallpaperInfo.mode === 'random')
    await newTabState.changeWallpaper()
}
init()

const random = async() => {
  await newTabState.changeWallpaper()
}

const changeMode = async() => {
  newTabState.changeWallpaperMode()
}

watch([data.wallpaperInfo, backgroundOpacity], () => {
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${wallpaper.value.url}), ${data.backgroundOpacity}%)`,
  }
})

watch(backgroundOpacity, (newValue) => {
  newTabState.changeWallpaperOpcity(newValue)
})

const showSettingBg = (show = true) => {
  data.settingBg = show
}

watch(popover, (newValue) => {
  data.showOpacity = !!newValue
})
</script>
<style lang="less">
.zen-opacity-slider {
  border-radius: 1.5rem 1.5rem 0 0;
}
</style>
