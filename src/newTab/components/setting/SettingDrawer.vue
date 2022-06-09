<template>
  <n-drawer
    v-model:show="settingDrawer"
    :placement="(settingDrawerPosition === 'left') ? 'left' : 'right'"
    width="500px"
    :auto-focus="false"
  >
    <div class="flex h-screen max-h-screen pt-4">
      <div
        v-if="settingDrawerPosition === 'right'"
        class="w-2 h-full flex-grow flex flex-col justify-center opacity-20 cursor-pointer hover:(opacity-100)"
        @click="newTabState.changeSettingDrawerPosition('left')"
      >
        <mdi-chevron-left />
      </div>

      <Setting class="w-[calc(100%-1rem)] overflow-y-auto" :class="(settingDrawerPosition === 'left') ? 'pl-4' : 'pr-4'" />

      <div
        v-if="settingDrawerPosition === 'left'"
        class="w-2 h-full flex-grow flex flex-col justify-center opacity-20 cursor-pointer hover:(opacity-100)"
        @click="newTabState.changeSettingDrawerPosition('right')"
      >
        <mdi-chevron-right />
      </div>
    </div>
  </n-drawer>
</template>
<script setup lang="ts">
import { useNewTabState } from '@newTab/store/newTab'
import Setting from './Setting.vue'

const newTabState = useNewTabState()
const { settingDrawer, settingDrawerPosition } = storeToRefs(newTabState)

</script>
