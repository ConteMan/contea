<script setup lang="ts">
import { SourceTypes } from '@services/wallpaper/model'
import { useNewTabState } from '@newTab/store/index'

const newTabState = useNewTabState()

const data = reactive({
  showDrawer: false, // 抽屉显隐
  wallpaper: {} as any,
  backgroundOpacity: 0,
  uploadRef: null as any,
})
const { showDrawer, wallpaper, backgroundOpacity, uploadRef } = toRefs(data)

const { wallpaper: wallpaperStore } = storeToRefs(newTabState)
data.wallpaper = wallpaperStore

const init = async () => {
  if (data.wallpaper.mode === 'random') {
    await newTabState.changeWallpaper()
  }
  else {
    if (data.wallpaper.url)
      data.backgroundOpacity = data.wallpaper.opacity
  }
}
init()

watch(backgroundOpacity, (newValue) => {
  newTabState.changeWallpaperOpacity(newValue)
})

const changeTheme = () => {
  newTabState.changeTheme(newTabState.theme === 'dark' ? 'light' : 'dark')
}

const uploadClick = () => {
  uploadRef.value.click()
}

const uploadHandleChange = () => {
  const file = uploadRef.value.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result)
      newTabState.setLocalWallpaper(String(e.target?.result))
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div>
    <div class="action-bar-container fixed bottom-0 left-0 px-4 py-4 text-[14px] rounded-tr-md flex flex-col justify-end gap-2 hover:(opacity-100)">
      <a class="icon-btn" title="布局模式" @click="newTabState.changeLayoutMode()">
        <mdi-apps v-if="newTabState.layoutMode === 'clean'" />
        <mdi-apps-box v-else />
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
        :to="false"
        class="opacity-popover"
      >
        <template #trigger>
          <a class="icon-btn" title="背景透明度">
            <mdi-opacity />
          </a>
        </template>
        <div class="h-[200px]">
          <n-slider
            v-model:value="data.backgroundOpacity"
            class="zen-opacity-slider bg-light-400"
            vertical
            :format-tooltip="(value: any) => `${value}%`"
          />
        </div>
      </n-popover>

      <a v-if="wallpaper.mode === 'random'" class="icon-btn" title="切换背景" @click="newTabState.changeWallpaper()">
        <la-random />
      </a>

      <a class="icon-btn" title="固定背景" @click="newTabState.changeWallpaperMode()">
        <mdi-pin-off-outline v-if="wallpaper.mode === 'random'" />
        <mdi-pin v-else />
      </a>

      <a class="icon-btn" title="背景设置" @click="data.showDrawer = !data.showDrawer">
        <mdi-wallpaper />
      </a>

      <a class="icon-btn !opacity-40 hover:(!opacity-100)" title="应用设置" @click="newTabState.changeSettingDrawer()">
        <mdi-cog />
      </a>
    </div>

    <n-drawer
      v-model:show="showDrawer"
      class="py-4 px-4"
      placement="bottom"
      :auto-focus="false"
    >
      <div v-if="['fixed', 'random'].includes(wallpaper.mode) && wallpaper.url.length < 500" class="pb-2">
        <div class="mb-1">
          当前
        </div>
        <div>
          <a :href="wallpaper.url">{{ wallpaper.url }}</a>
        </div>
      </div>
      <div class="pb-2">
        <div class="mb-1">
          线上
        </div>
        <n-cascader
          v-model:value="wallpaper.source"
          :options="SourceTypes"
          multiple
          check-strategy="child"
          label-field="name"
          value-field="key"
          children-field="category"
        />
      </div>
      <div class="pb-2">
        <div class="mb-1">
          本地
        </div>
        <n-button size="small" @click="uploadClick()">
          点击上传
        </n-button>
        <div class="invisible">
          <input
            ref="uploadRef"
            type="file"
            @change="uploadHandleChange"
          >
        </div>
      </div>
    </n-drawer>
  </div>
</template>

<style lang="less" scoped>
:deep(.n-popover) {
  border-radius: 1.5rem;
  background: none;
}
.zen-opacity-slider {
  border-radius: 1.5rem;
}
.icon-btn {
  cursor: pointer;
  display: inline-flex;
  justify-items: center;
  align-items: center;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
}
.action-bar-container {
  &:hover {
    // background-color: rgba(156, 163, 175, .2);
    .icon-btn {
      opacity: 1 !important;
    }
  }
}
// .dark .action-bar-container {
//   &:hover {
//     background-color: rgba(156, 163, 175, .2);
//   }
// }
</style>
