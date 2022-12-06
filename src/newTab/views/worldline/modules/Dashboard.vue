<script setup lang="ts">
import type { Component } from 'vue'
import _ from 'lodash-es'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import DragBox from '@newTab/components/drag/DragBox.vue'
import { useNewTabState } from '@newTab/store/index'

import Weather from '@newTab/components/weather/WeatherCard.vue'
import BilibiliCard from '@newTab/components/bilibili/BilibiliCard.vue'

interface Data {
  list: any[]
  modules: string[]
}

interface ComponentItem {
  key: string
  name: string
  component: Component
}

type ComponentType = Record<string, ComponentItem>

const components: ComponentType = {
  weather: {
    key: 'weather',
    name: '天气',
    component: Weather,
  },
  bilibili: {
    key: 'bilibili',
    name: 'Bilibili',
    component: BilibiliCard,
  },
}

const data: Data = reactive({
  list: [],
  modules: [],
})
const { modules } = toRefs(data)

const newTabStore = useNewTabState()
const { worldlineModules } = storeToRefs(newTabStore)
data.modules = worldlineModules.value

const getComponent = (name: string) => {
  if (!Object.keys(components).includes(name))
    return false
  return components[name].component ?? false
}

watch(worldlineModules, (newValue) => {
  data.modules = newValue
})
watch(modules, (newValue) => {
  newTabStore.setWorldlineModules(newValue)
})

const moduleOptions = computed(() => {
  const values = Object.values(components)
  const options = values.map((item) => {
    return modules.value.includes(item.key) ? { label: item.name, key: item.key, disabled: true } : { label: item.name, key: item.key, disabled: false }
  })
  return options
})
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <div class="worldline-action-bar w-full">
        <n-popover trigger="hover" :show-arrow="false" :to="false">
          <template #trigger>
            <mdi:adjust class="module-check cursor-pointer select-none outline-transparent" />
          </template>
          <n-checkbox-group v-model:value="modules">
            <div class="flex flex-col gap-2">
              <n-checkbox v-for="item in moduleOptions" :key="item.key" :value="item.key" :label="item.label" />
            </div>
          </n-checkbox-group>
        </n-popover>
      </div>
    </template>

    <template #content>
      <div class="relative h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-wrap gap-4">
        <template
          v-for="item in modules"
          :key="item"
        >
          <DragBox v-bind="{ name: item }">
            <Component :is="getComponent(item)" class="h-full" />
          </DragBox>
        </template>
      </div>
    </template>
  </WorldlineContent>
</template>

<style lang="less" scoped>
.action-btn {
  opacity: 0;
}
.bar:hover {
  .action-btn {
    opacity: 100;
  }
}
:deep(.vue-grid-item) {
  background-color: unset;
}
:deep(.vue-grid-item.vue-grid-placeholder) {
  background: unset;
}
:deep(.vue-resizable-handle) {
  opacity: 0;
}
:deep(.vue-grid-item:hover > .vue-resizable-handle) {
  opacity: 1;
}
:deep(.worldline-bar-container) {
  opacity: 0;
}
:deep(.worldline-bar-container:hover) {
  opacity: 1;
}
</style>
