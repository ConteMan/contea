<script setup lang="ts">
import type { Component, Ref } from 'vue'
import type { DashboardLayout } from '@localTypes/newTab'
import _ from 'lodash-es'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import { useNewTabState } from '@newTab/store/index'

import Weather from '@newTab/components/weather/WeatherCard.vue'
import BilibiliCard from '@newTab/components/bilibili/BilibiliCard.vue'

interface Data {
  loading: boolean
  list: any[]
  layout: DashboardLayout
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
  loading: true,
  list: [],
  layout: [],
})
const { loading, layout } = toRefs(data)

const showCards: Ref<(string | undefined)[]> = computed(() => {
  return layout.value
    ? layout.value.map((item) => {
      return item.name
    })
    : []
})

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
  let i = 0
  if (layout.value.length) {
    layout.value.forEach((item) => {
      if (!i || item.i > i)
        i = item.i
    })
  }
  layout.value.push({ x: 0, y: 0, w: 2, h: 2, i: i + 1, name })
}

watch(worldlineDashboardLayout, (newValue) => {
  data.layout = newValue
})

const showAddDropdown = ref(false)
const addDropdownOptions = computed(() => {
  const values = Object.values(components)
  const options = values.map((item) => {
    return showCards.value.includes(item.key) ? { label: item.name, key: item.key, disabled: true } : { label: item.name, key: item.key, disabled: false }
  })
  // eslint-disable-next-line no-console
  console.log('[ options ] >', options)
  return options
})
const toggleAdd = () => {
  showAddDropdown.value = !showAddDropdown.value
}
const addDropdownSelect = (_key: string, _option: ComponentItem) => {
  addCard(_key)
}
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <n-dropdown
        :show="showAddDropdown"
        :options="addDropdownOptions"
        @select="addDropdownSelect"
      >
        <span class="cursor-pointer py-2 px-4 flex items-center" @click="toggleAdd">
          <mdi-plus />
        </span>
      </n-dropdown>
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
              :key="`${item.name}-${item.i}`"
              v-bind="gridItemProps"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              class="bg-opacity-0"
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
</style>
