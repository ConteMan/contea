<template>
  <div class="w-full h-screen bg-center bg-cover" :style="data.wallpaperStyle">
    <div class="zen-setting-container fixed bottom-1 right-2 space-x-2 rounded-md pt-2 px-2 hover:(bg-light-400)" :class="{ '!bg-light-400': settingBg }">
      <mdi-card-text class="opacity-30 cursor-pointer hover:(opacity-100)" @click="toModulePage" />
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
      <mdi-information-outline class="opacity-30 cursor-pointer hover:(opacity-100)" @click="data.showDrawer = !data.showDrawer" />
    </div>
    <n-drawer
      v-model:show="showDrawer"
      class="py-4 px-4"
      placement="bottom"
      :auto-focus="false"
    >
      <div class="pb-2">
        <span>当前</span>
        <div>
          <a :href="wallpaperInfo.url">{{ wallpaperInfo.url }}</a>
        </div>
      </div>
      <n-grid cols="24">
        <n-grid-item :span="24">
          <span>来源</span>
          <n-cascader
            v-model:value="wallpaperInfo.source"
            multiple
            check-strategy="child"
            :options="wallpaperSourceOptions"
            label-field="name"
            value-field="key"
            children-field="category"
          />
        </n-grid-item>
      </n-grid>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import { SourceTypes } from '@services/wallpaper/model'
import { useNewTabState } from '~/store/newTab'

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
  backgroundOpacity: 0,
  settingBg: false, // 设置栏背景显隐
  showOpacity: false, // Opacity 按钮显隐
  showDrawer: false, // 抽屉显隐
  wallpaperSourceOptions: [] as any,
})
const { wallpaperInfo, backgroundOpacity, settingBg, showOpacity, showDrawer, wallpaperSourceOptions } = toRefs(data)
const popover = ref(null)

const router = useRouter()
const toModulePage = () => {
  router.push({ path: '/module' })
}

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
  data.wallpaperSourceOptions = SourceTypes
}
init()

const random = async() => {
  await newTabState.changeWallpaper()
}

const changeMode = async() => {
  newTabState.changeWallpaperMode()
}

watch(() => data.wallpaperInfo, (newWallpaperInfo) => {
  data.wallpaperStyle = {
    'background-image': `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${newWallpaperInfo.url}), ${newWallpaperInfo.opacity}%)`,
  }
}, { deep: true })

watch(backgroundOpacity, (newValue) => {
  newTabState.changeWallpaperOpacity(newValue)
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
<style lang="less" scoped>
.zen-opacity-slider {
  border-radius: 1.5rem;
}
</style>
