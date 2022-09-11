<script setup lang="ts">
import _ from 'lodash-es'

import { useConfigState } from '@newTab/store/config'
import V2ex from './modules/V2ex.vue'
import Sspai from './modules/Sspai.vue'
import Status from './modules/Status.vue'
// import Jike from './modules/Jike.vue'
// import Zhihu from './modules/Zhihu.vue'
// import Movie from './modules/Movie.vue'
// import Sport from './modules/Sport.vue'

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

const menuOptions = [
  {
    label: 'V2EX',
    key: 'v2ex',
  },
  {
    label: '少数派',
    key: 'sspai',
  },
  // {
  //   label: '即刻',
  //   key: 'jike',
  // },
  // {
  //   label: '知乎',
  //   key: 'zhihu',
  // },
  // {
  //   label: '体育',
  //   key: 'sport',
  // },
  {
    label: '定时',
    key: 'status',
  },
]

const dealMenuOptions = computed(() => {
  const specialKeys: string[] = []

  if (data.config?.base?.statusList)
    specialKeys.push('status')

  return menuOptions.filter((item: any) => {
    if (specialKeys.length && specialKeys.includes(item.key))
      return true
    if (item?.type && ['divider', 'system'].includes(item.type))
      return true
    return _.findIndex(Object.values(data.config), (configItem: any) => {
      return toRaw(configItem.key) === item.key && toRaw(configItem.enable)
    }) > 0
  })
})

const getDefaultKey = (options: any[]) => {
  const index = _.findIndex(options, (item: any) => {
    return item.type !== 'divider' && !item.disabled
  })
  if (index < 0)
    return ''
  else
    return options[index].key
}

const init = () => {
  if (Object.values(dealMenuOptions.value).length)
    activeKey.value = getDefaultKey(Object.values(dealMenuOptions.value))
}
init()

watch(dealMenuOptions, (newValue) => {
  if (!Object.values(newValue).length) {
    activeKey.value = ''
    return
  }

  if (!activeKey.value && Object.values(newValue).length)
    activeKey.value = getDefaultKey(Object.values(newValue))
})
</script>

<template>
  <div ref="worldlineContainerRef" class="max-h-full flex">
    <div class="worldline-menu h-full pt-8">
      <n-menu
        v-model:value="activeKey"
        :options="dealMenuOptions"
        :indent="18"
        @update:value="changeActiveKey"
      />
    </div>
    <div class="worldline-tab-pane-container flex-1 w-0 h-full">
      <V2ex v-if="activeKey === 'v2ex'" class="h-full" />
      <Sspai v-if="activeKey === 'sspai'" class="h-full" />
      <!-- <Jike v-if="activeKey === 'jike'" class="h-full" />
      <Zhihu v-if="activeKey === 'zhihu'" class="h-full" />
      <Movie v-if="activeKey === 'movie'" class="h-full" />
      <Sport v-if="activeKey === 'sport'" class="h-full" /> -->
      <Status v-if="activeKey === 'status'" class="h-full" />
    </div>
  </div>
</template>

<style scoped>
.worldline-menu {
  min-width: fit-content;
  max-width: fit-content;
}
</style>
