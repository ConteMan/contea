<script setup lang="ts">
import type { Component, Ref } from 'vue'
import _ from 'lodash-es'
import draggable from 'vuedraggable'
import { useConfigState, useNewTabState } from '@newTab/store/index'

type ModuleItem = Store.MenuItem & {
  component?: Component
  title?: string
  config?: Record<string, any>
}

const NewTabStore = useNewTabState()
const { tabSelected, worldlineMenu } = storeToRefs(NewTabStore)

const activeMenu = ref('')
const changeMenu = (key: string) => {
  NewTabStore.changeTab(key)
}
watch(tabSelected, (newValue) => {
  activeMenu.value = newValue
})

const ConfigStore = useConfigState()
const { all } = storeToRefs(ConfigStore)

const file: Record<string, Component> = import.meta.glob('./modules/*.vue', { import: 'default', eager: true })
const paths = Object.keys(file)

// 已开启模块
const modules = computed(() => {
  const res: Record<string, ModuleItem> = {}
  paths.forEach((path) => {
    const key = path.replace('\.\/modules\/', '').replace('.vue', '').toLowerCase()
    if (key === 'status' && all.value.base.statusList) {
      res[key] = {
        key,
        type: 'module',
        title: '定时任务',
        component: file[path],
      }
      return
    }
    if (all.value?.[key] && all.value?.[key].enable) {
      res[key] = {
        key,
        type: 'module',
        title: all.value[key].name,
        config: all.value?.[key],
        component: file[path],
      }
    }
  })
  return res
})

// 处理菜单数据
const dealModule = (data: Store.MenuItem[]) => {
  const currentModules = { ...modules.value }
  const currentModuleKeys = Object.keys(currentModules)
  const dealModules: Store.MenuItem[] = []
  if (data.length) { // Store 存在数据
    data.forEach((wItem) => {
      if (wItem.type !== 'module') { // 不是模块数据，通过
        dealModules.push(wItem)
      }
      else {
        if (currentModules?.[wItem.key]) { // 是模块数据，且存在组件，通过
          dealModules.push(wItem)
          _.pull(currentModuleKeys, wItem.key)
        }
      }
    })
    if (currentModuleKeys.length) { // 加载的组件中存在未配置，通过
      currentModuleKeys.forEach((cItem) => {
        dealModules.push({
          key: currentModules[cItem].key,
          type: currentModules[cItem].type,
        })
      })
    }
  }
  else {
    currentModuleKeys.forEach((cItem) => {
      dealModules.push({
        key: currentModules[cItem].key,
        type: currentModules[cItem].type,
      })
    })
  }
  NewTabStore.setWorldlineMenu(dealModules)
}
dealModule(worldlineMenu.value)

const menu: Ref<ModuleItem[]> = ref([])

// 处理后的菜单数组，主要是关联组件和配置
const dealMenu = (data: ModuleItem[]) => {
  const res: ModuleItem[] = []
  data.forEach((item) => {
    if (item.type !== 'module') {
      res.push(item)
    }
    else {
      if (modules.value[item.key]) {
        res.push({
          key: item.key,
          type: item.type,
          component: modules.value[item.key].component,
          config: modules.value[item.key].config,
          title: modules.value[item.key].title,
        })
      }
    }
  })
  menu.value = res
  return res
}

// 处理后的菜单键数组
const dealMenuKeys = computed(() => {
  const keys: string[] = []
  menu.value.forEach((item) => {
    keys.push(item.key)
  })
  NewTabStore.setDealMenuKeys(keys)
  return keys
})

// 模块类型数据（含有组件）
const dealModuleComponents = computed(() => {
  return menu.value.filter((item) => {
    return item.type === 'module'
  })
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
    return item.type !== 'other'
  })
  if (index < 0)
    return ''
  else
    return options[index].key
}

const init = () => {
  dealMenu(worldlineMenu.value)
  activeMenu.value = getDefaultKey(Object.values(menu.value), tabSelected.value)
}
init()

watch(() => all.value, (newValue) => {
  dealModule(worldlineMenu.value)
  dealMenu(worldlineMenu.value)
})
watch(() => menu, (newValue) => {
  // eslint-disable-next-line no-console
  console.log('menu newValue', newValue)
  dealModule(newValue.value)

  if (!newValue.value.length) {
    activeMenu.value = ''
    NewTabStore.changeTab('')
    return
  }

  if (!activeMenu.value || !dealMenuKeys.value.includes(tabSelected.value)) {
    activeMenu.value = getDefaultKey(Object.values(newValue.value))
    NewTabStore.changeTab(activeMenu.value)
  }
}, {
  deep: true,
})
</script>

<template>
  <div class="max-h-full flex">
    <div class="h-full pt-10 pb-4 pl-6 pr-2 bg-gray-400 bg-opacity-20 flex flex-col items-start gap-2">
      <draggable
        tag="div"
        item-key="key"
        handle=".handle"
        :list="menu"
        class="overflow-y-auto flex flex-col px-2"
      >
        <template #item="{ element }">
          <div
            v-if="element.type === 'module'"
            class="py-2 pr-4 flex items-center cursor-pointer hover:(text-red-600)"
            :class="{ 'menu-active text-red-600 font-bold': activeMenu === element.key }"
          >
            <span class="handle flex items-center opacity-0 hover:(opacity-100)">
              <mdi-format-align-justify />
            </span>
            <span class="pl-4" @click="changeMenu(element.key)">{{ element.title }}</span>
          </div>
        </template>
      </draggable>
    </div>
    <div class="h-full w-[1px] bg-gray-400 bg-opacity-10 flex-shrink-0 flex-grow-0" />
    <div class="flex-1 w-0 h-full">
      <template v-for="item in dealModuleComponents" :key="item.key">
        <Component :is="item.component" v-if="activeMenu === item.key" class="h-full" />
      </template>
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
