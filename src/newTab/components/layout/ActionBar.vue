<template>
  <div>
    <div class="flex justify-end gap-2 zen-setting-container fixed bottom-4 right-8 text-[14px] rounded-md p-2 opacity-40 hover:(opacity-100)">
      <a class="icon-btn" title="布局模式" @click="newTabState.changeLayoutMode()">
        <mdi-border-all-variant v-if="newTabState.layoutMode === 'clean'" />
        <mdi-border-all v-else />
      </a>

      <a class="icon-btn" title="主题" @click="changeTheme()">
        <ic-sharp-light-mode v-if="newTabState.theme === 'light'" />
        <ic-sharp-dark-mode v-else />
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
          <a class="icon-btn" title="背景透明度">
            <mdi-opacity />
          </a>
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

      <a v-if="wallpaperInfo.mode === 'random'" class="icon-btn" title="切换背景" @click="random()">
        <la-random />
      </a>

      <a class="icon-btn" title="固定背景" @click="changeMode()">
        <mdi-pin-off-outline v-if="wallpaperInfo.mode === 'random'" />
        <mdi-pin v-else class="icon-btn" @click="changeMode()" />
      </a>

      <a class="icon-btn" title="背景设置" @click="data.showDrawer = !data.showDrawer">
        <mdi-wallpaper />
      </a>

      <a class="icon-btn" title="应用设置" @click="changeSettingDrawer()">
        <mdi-cog />
      </a>
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
import { useNewTabState } from '@newTab/store/newTab'

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
