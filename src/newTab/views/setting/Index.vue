<script setup lang="ts">
import { useNewTabState } from '@newTab/store/newTab'

import Base from './Base.vue'
import Module from './Module.vue'
import Board from './Board.vue'

const newTabState = useNewTabState()
const { settingDrawer, settingDrawerPosition } = storeToRefs(newTabState)
</script>

<template>
  <n-drawer
    v-model:show="settingDrawer"
    class="setting-drawer"
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

      <div class="w-[calc(100%-1rem)] h-full setting-container max-w-[700px]" :class="(settingDrawerPosition === 'left') ? 'pl-4' : 'pr-4'">
        <n-tabs class="setting-tab h-full" type="line" default-value="base">
          <n-tab-pane name="base" tab="基础">
            <div class="base-pane !px-[1rem] mt-[0.5rem] mb-[1rem]">
              <Base />
            </div>
          </n-tab-pane>

          <n-tab-pane name="module" tab="模块">
            <Module />
          </n-tab-pane>

          <n-tab-pane name="board" tab="面板">
            <div class="base-pane !px-[1rem] mt-[0.5rem] mb-[1rem]">
              <Board />
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>

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

<style lang="less">
.contea-namespace {
  .setting-drawer .n-drawer-content-wrapper {
    overflow: hidden !important;
  }
}
</style>

<style lang="less" scoped>
.setting-tab {
  :deep(.n-tab-pane) {
    overflow: overlay;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  :deep(.n-form-item .n-form-item-blank) {
    padding-left: 2rem;
  }
  &::-webkit-scrollbar {
    width: 0;
  }
}
.base-pane {
  padding: var(--n-pane-padding);
  background-color: rgba(209, 213, 219, 0.178);
  border-radius: 0.25rem;
}
</style>
