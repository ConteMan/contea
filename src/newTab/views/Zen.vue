<template>
  <div class="w-full h-screen bg-center bg-cover" :style="data.wallpaperStyle">
    <div class="fixed bottom-1 right-2 space-x-2">
      <la-random v-if="data.wallpaperInfo.mode === 'random'" class="opacity-30 cursor-pointer" @click="random()" />
      <mdi-pin-off-outline v-if="data.wallpaperInfo.mode === 'random'" class="opacity-30 cursor-pointer" @click="fixed()" />
      <mdi-pin v-else class="opacity-30 cursor-pointer" @click="fixed()" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useNewTabState } from '~/store/newTab'

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
})

const newTabState = useNewTabState()
const { wallpaper } = storeToRefs(newTabState)
data.wallpaperInfo = wallpaper
if (wallpaper.value.url) {
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${wallpaper.value.url}), 10%)`,
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

const fixed = async() => {
  newTabState.changeWallpaperMode()
}

watch(wallpaper, (newValue) => {
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${newValue.url}), 10%)`,
  }
})
</script>
