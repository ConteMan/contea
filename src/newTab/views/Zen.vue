<template>
  <keep-alive>
    <div class="w-full h-screen bg-center bg-cover" :style="data.wallpaperStyle">
    </div>
  </keep-alive>
</template>
<script setup lang="ts">
import wallpaper from '~/services/wallpaper'

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
})

const getWallpaper = async() => {
  data.wallpaperInfo = await wallpaper.random()
  if (data.wallpaperInfo?.oriImgUrl) {
    data.wallpaperStyle = {
      'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${data.wallpaperInfo.oriImgUrl}), 10%)`,
    }
  }
}
getWallpaper()
</script>
