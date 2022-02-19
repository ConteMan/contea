<template>
  <div ref="worldlineContainerRef" class="h-full flex">
    <div class="worldline-menu pt-8">
      <n-menu
        v-model:value="activeKey"
        :options="dealMenuOptions"
        :indent="18"
        @update:value="changeActiveKey"
      ></n-menu>
    </div>
    <div class="worldline-tab-pane-container flex-1 w-0">
      <V2ex v-if="activeKey === 'v2ex'" class="h-full" />
      <Sspai v-else-if="activeKey === 'sspai'" class="h-full" />
      <Jike v-else-if="activeKey === 'jike'" class="h-full" />
      <Zhihu v-else-if="activeKey === 'zhihu'" class="h-full" />
      <n-empty v-else description="Nothing ~"></n-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash-es'
import { useElementBounding } from '@vueuse/core'

import V2ex from './modules/V2ex.vue'
import Sspai from './modules/Sspai.vue'
import Jike from './modules/Jike.vue'
import Zhihu from './modules/Zhihu.vue'

import { useConfigState } from '~/store/config'

const activeKey = ref('')
const changeActiveKey = (key: string) => {
  activeKey.value = key
}

const data = reactive({
  config: {} as any,
  worldlineContainerRef: null,
  worldlineTabRef: null,
})
const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all

const { worldlineContainerRef, worldlineTabRef } = toRefs(data)

const { height: containerHeight } = useElementBounding(worldlineContainerRef)
const { height: tabHeight } = useElementBounding(worldlineTabRef)
const dealTabHeight = computed(() => {
  return `${containerHeight.value - tabHeight.value}px`
})

const menuOptions = [
  {
    label: 'V2EX',
    key: 'v2ex',
  },
  {
    label: '少数派',
    key: 'sspai',
  },
  {
    label: '即刻',
    key: 'jike',
  },
  {
    label: '知乎',
    key: 'zhihu',
  },
]

const dealMenuOptions = computed(() => {
  return menuOptions.filter((item) => {
    return _.findIndex(Object.values(data.config), (configItem: any) => {
      return toRaw(configItem.key) === item.key && toRaw(configItem.enable)
    }) > 0
  })
})

const init = () => {
  if (Object.values(dealMenuOptions.value).length)
    activeKey.value = Object.values(dealMenuOptions.value)[0].key
}
init()

watch(dealMenuOptions, (newValue) => {
  if (!Object.values(newValue).length) {
    activeKey.value = ''
    return
  }

  if (!activeKey.value && Object.values(newValue).length)
    activeKey.value = Object.values(newValue)[0].key
})
</script>

<style scoped>
.worldline-menu {
  min-width: fit-content;
  max-width: fit-content;
}
.worldline-tab-pane-container {
  height: v-bind(dealTabHeight);
}
</style>
