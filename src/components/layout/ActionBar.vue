<template>
  <div>
    <div class="flex justify-end gap-2 zen-setting-container fixed bottom-1 right-8 text-[14px] rounded-md p-2 opacity-40 hover:(opacity-100)">
      <a class="icon-btn" @click="changeTheme()">
        <ic:sharp-light-mode v-if="newTabState.theme === 'light'" />
        <ic:sharp-dark-mode v-else />
      </a>
      <n-popover
        trigger="hover"
        raw
        display-directive="show"
        placement="top"
        :keep-alive-on-hover="true"
        :show-arrow="false"
        :overlap="false"
        :duration="100"
      >
        <template #trigger>
          <mdi-opacity class="icon-btn" />
        </template>
        <div
          class="h-[200px] mb-[10px]"
        >
          <n-slider
            v-model:value="data.backgroundOpacity"
            class="zen-opacity-slider bg-light-400"
            vertical
            :format-tooltip="(value: any) => `${value}%`"
          />
        </div>
      </n-popover>
      <la:random v-if="wallpaperInfo.mode === 'random'" class="icon-btn" @click="random()" />
      <mdi:pin-off-outline v-if="wallpaperInfo.mode === 'random'" class="icon-btn" @click="changeMode()" />
      <mdi:pin v-else class="icon-btn" @click="changeMode()" />
      <mdi:wallpaper class="icon-btn" @click="data.showDrawer = !data.showDrawer" />
      <mdi:cog class="icon-btn" @click="changeSettingDrawer()" />
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

const newTabState = useNewTabState()

const data = reactive({
  wallpaperInfo: {} as any,
  wallpaperStyle: {} as any,
  backgroundOpacity: 0,
  showDrawer: false, // 抽屉显隐
  wallpaperSourceOptions: [] as any,
})
const { wallpaperInfo, backgroundOpacity, showDrawer, wallpaperSourceOptions } = toRefs(data)

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

watch(backgroundOpacity, (newValue) => {
  newTabState.changeWallpaperOpacity(newValue)
})

// 显示/隐藏设置抽屉
const changeSettingDrawer = () => {
  newTabState.changeSettingDrawer()
}

const changeTheme = () => {
  newTabState.changeTheme(newTabState.theme === 'dark' ? 'light' : 'dark')
}
</script>

<style>
.zen-opacity-slider {
  border-radius: 1.5rem;
}
.icon-btn {
  cursor: pointer;
}
</style>
