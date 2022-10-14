<script setup lang="ts">
import type { Component } from 'vue'
import type { DashboardLayout } from '@localTypes/newTab'
import _ from 'lodash-es'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import { useNewTabState } from '@newTab/store/index'

import Weather from '@newTab/components/weather/WeatherCard.vue'

interface Data {
  loading: boolean
  list: any[]
  layout: DashboardLayout
}

type ComponentType = Record<string, {
  key: string
  name: string
  component: Component
}>

const components: ComponentType = {
  weather: {
    key: 'weather',
    name: '天气',
    component: Weather,
  },
}

const data: Data = reactive({
  loading: true,
  list: [],
  layout: [
    { x: 0, y: 0, w: 2, h: 2, i: 0, name: 'weather' },
  ],
})
const { loading, layout } = toRefs(data)

const newTabStore = useNewTabState()
const { worldlineDashboardLayout } = storeToRefs(newTabStore)
data.layout = worldlineDashboardLayout.value

const getComponent = (name: string) => {
  if (!Object.keys(components).includes(name))
    return false
  return components[name].component ?? false
}

const layoutUpdated = (newLayout: DashboardLayout) => {
  newTabStore.setWorldlineDashboardLayout(newLayout)
}

const closeCard = (name: string | undefined) => {
  if (name) {
    _.remove(layout.value, (item) => {
      return item.name === name
    })
  }
}

const addCard = (name: string) => {
  layout.value.push({ x: 0, y: 0, w: 2, h: 2, i: 0, name })
}

watch(worldlineDashboardLayout, (newValue) => {
  data.layout = newValue
})
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <span class="cursor-pointer py-2 px-4 flex items-center" @click="addCard('weather')">
        <mdi-plus />
      </span>
    </template>

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4">
        <GridLayout
          v-model:layout="layout"
          :col-num="12"
          :row-height="30"
          @update:layout="layoutUpdated"
        >
          <template #default="{ gridItemProps }">
            <grid-item
              v-for="item in layout"
              :key="item.i"
              v-bind="gridItemProps"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
            >
              <div class="no-drag h-full flex flex-col">
                <div class="bar pt-2 pb-1 px-4 flex justify-end flex-nowrap items-center">
                  <span class="action-btn cursor-pointer flex-grow-0 flex-shrink-0 flex items-center" @click="closeCard(item.name)">
                    <mdi-close />
                  </span>
                </div>
                <div class="no-drag w-full">
                  <template v-if="item.name && getComponent(item.name)">
                    <Component :is="getComponent(item.name)" class="h-full" />
                  </template>
                </div>
              </div>
            </grid-item>
          </template>
        </GridLayout>
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
</style>
