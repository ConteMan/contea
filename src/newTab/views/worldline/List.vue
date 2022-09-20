<script setup lang="ts">
import _ from 'lodash-es'

import { useConfigState, useNewTabState } from '@newTab/store/index'

import Sspai from './modules/Sspai.vue'
import Bilibili from './modules/Bilibili.vue'
import One from './modules/One.vue'
import Weread from './modules/Weread.vue'
import Status from './modules/Status.vue'

const NewTabStore = useNewTabState()
const { tabSelected } = storeToRefs(NewTabStore)

const activeKey = ref('')
const changeActiveKey = (key: string) => {
  NewTabStore.changeTab(key)
}

watch(tabSelected, (newValue) => {
  activeKey.value = newValue
})

const data = reactive({
  config: {} as any,
  worldlineContainerRef: null,
  worldlineTabRef: null,
})

const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all

const menuOptions = [
  {
    label: '少数派',
    key: 'sspai',
  },
  {
    label: '哔哩哔哩',
    key: 'bilibili',
  },
  {
    label: '微信读书',
    key: 'weread',
  },
  {
    label: '一个',
    key: 'one',
  },
  {
    label: '定时',
    key: 'status',
  },
]

// 处理后的菜单数组
const dealMenuOptions = computed(() => {
  const specialKeys: string[] = []

  if (data.config?.base?.statusList)
    specialKeys.push('status')

  return menuOptions.filter((item: any) => {
    if (specialKeys.length && specialKeys.includes(item.key))
      return true
    return _.findIndex(Object.values(data.config),
      (configItem: any) => {
        return toRaw(configItem.key) === item.key && toRaw(configItem.enable)
      }) > 0
  })
})

// 处理后的菜单键数组
const dealMenuKeys = computed(() => {
  const keys: string[] = []
  dealMenuOptions.value.forEach((item) => {
    keys.push(item.key)
  })
  NewTabStore.setDealMenuKeys(keys)
  return keys
})

// 处理默认选择 Tab
const getDefaultKey = (options: any[], key = '') => {
  if (key) {
    const index = _.findIndex(options, (item: any) => {
      return item.key === key
    })
    if (index)
      return key
  }

  const index = _.findIndex(options, (item: any) => {
    return item.type !== 'divider' && !item.disabled
  })
  if (index < 0)
    return ''
  else
    return options[index].key
}

const init = () => {
  if (dealMenuOptions.value.length)
    activeKey.value = getDefaultKey(Object.values(dealMenuOptions.value), tabSelected.value)
}
init()

watch(dealMenuOptions, (newValue) => {
  if (!newValue.length) {
    activeKey.value = ''
    NewTabStore.changeTab('')
    return
  }

  if (!activeKey.value || !dealMenuKeys.value.includes(tabSelected.value)) {
    activeKey.value = getDefaultKey(Object.values(newValue))
    NewTabStore.changeTab(activeKey.value)
  }
})
</script>

<template>
  <div ref="worldlineContainerRef" class="max-h-full flex">
    <div class="worldline-menu h-full pt-10 pb-4 pl-6 pr-2 bg-gray-400 bg-opacity-20 flex flex-col items-start gap-2">
      <div
        v-for="item in dealMenuOptions" :key="item.key"
        class="py-2 px-4 cursor-pointer hover:(text-red-600)"
        :class="{ 'menu-active text-red-600 font-bold': activeKey === item.key }"
        @click="changeActiveKey(item.key)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="h-full w-[1px] bg-gray-400 bg-opacity-10 flex-shrink-0 flex-grow-0" />
    <div class="worldline-content flex-1 w-0 h-full">
      <Sspai v-if="activeKey === 'sspai'" class="h-full" />
      <Bilibili v-if="activeKey === 'bilibili'" class="h-full" />
      <One v-if="activeKey === 'one'" class="h-full" />
      <Weread v-if="activeKey === 'weread'" class="h-full" />
      <Status v-if="activeKey === 'status'" class="h-full" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.menu-active {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 4px;
    z-index: 1;
    border-left: 4px solid red;
    height: 2em;
  }
}
</style>
