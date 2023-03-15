<script setup lang="ts">
import type { Ref } from 'vue'
import _ from 'lodash-es'
import draggable from 'vuedraggable'
import { useConfigState, useNewTabState } from '@newTab/store/index'

type ModuleItem = Store.MenuItem & {
  component?: string
  title?: string
  config?: Record<string, any>
}
type SpecialModule = Record<string, {
  key: string
  configModule: string
  configKey: string
  type: 'module'
  title: string
}>

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

const file: Record<string, string> = import.meta.glob('./modules/*.vue', { import: 'default', eager: true })
const paths = Object.keys(file)

// 特殊模块
const specialModules: SpecialModule = {
  status: {
    key: 'status',
    configModule: 'base',
    configKey: 'statusList',
    type: 'module',
    title: '任务',
  },
  test: {
    key: 'test',
    configModule: 'base',
    configKey: 'testPage',
    type: 'module',
    title: '测试',
  },
  dashboard: {
    key: 'dashboard',
    configModule: 'base',
    configKey: 'dashboardPage',
    type: 'module',
    title: '面板',
  },
  bookmark: {
    key: 'bookmark',
    configModule: 'base',
    configKey: 'moduleBookmark',
    type: 'module',
    title: '书签',
  },
  extension: {
    key: 'extension',
    configModule: 'base',
    configKey: 'moduleExtension',
    type: 'module',
    title: '扩展',
  },
}

/** modules 目录下的模块, 根据 all 更新 */
const modules = computed(() => {
  const res: Record<string, ModuleItem> = {}
  paths.forEach((path) => {
    const key = path.replace('\.\/modules\/', '').replace('.vue', '').toLowerCase()

    const specialModuleKeys = Object.keys(specialModules)
    if (specialModuleKeys.includes(key)) {
      const { configModule, configKey, type, title } = specialModules[key]
      if (all.value[configModule][configKey]) {
        res[key] = {
          key,
          type,
          title,
          config: {
            worldlineEnable: true,
          },
          component: file[path],
        }
      }
    }

    if (all.value?.[key]) {
      if (!all.value?.[key]?.enable || (typeof all.value?.[key]?.worldlineEnable !== 'undefined' && all.value?.[key]?.worldlineEnable))
        return

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

/** 处理菜单关联模块数据  */
const dealModule = (data: Store.MenuItem[]) => {
  const currentModules = { ...modules.value } // modules 目录下的模块
  const currentModuleKeys = Object.keys(currentModules)
  const dealModules: Store.MenuItem[] = []

  if (data.length) { // Store 存在数据
    data.forEach((wItem) => {
      if (['divider'].includes(wItem.type)) { // 特殊类型数据
        dealModules.push(wItem)
        return
      }
      if (['module'].includes(wItem.type)) {
        if (currentModules?.[wItem.key]) { // 模块数据，且存在组件、模块开启
          dealModules.push(wItem)
          _.pull(currentModuleKeys, wItem.key)
        }
      }
    })
  }

  if (currentModuleKeys.length) { // 加载的组件中存在状态保存中未配置的部分
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
    if (['divider'].includes(item.type)) {
      res.push(item)
      return
    }
    if (['module'].includes(item.type)) {
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
    if (item.type === 'module')
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

watch(() => all.value, () => {
  dealModule(worldlineMenu.value)
  dealMenu(worldlineMenu.value)
})
watch(() => menu, (newValue) => {
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

// 菜单模式
const menuMode = ref('')
const changeMenuMode = () => {
  menuMode.value = !menuMode.value ? 'edit' : ''
}

// 添加菜单内容
const addMenuItem = (type: Store.MenuItemType = 'divider') => {
  if (type === 'divider') {
    menu.value = [
      ...menu.value,
      {
        key: `divider-${new Date().getTime()}`,
        type,
      }]
  }
}
// 移除菜单内容
const removeMenuItem = (key: string, type: Store.MenuItemType = 'divider') => {
  if (type === 'divider') {
    menu.value = menu.value.filter((item) => {
      return item.key !== key
    })
  }
}
</script>

<template>
  <div class="max-h-full flex">
    <div class="h-full pt-10 bg-gray-400 bg-opacity-20 relative flex flex-col items-start gap-2">
      <draggable
        tag="div"
        item-key="key"
        handle=".handle"
        :list="menu"
        class="menu overflow-y-auto flex flex-col"
      >
        <template #item="{ element }">
          <div
            class="menu-item min-w-[160px] select-none flex justify-start items-center"
            :class="{ 'menu-active text-red-600 font-bold': activeMenu === element.key }"
          >
            <div v-if="element.type === 'module'" class="pl-8 py-2 cursor-pointer" @click="changeMenu(element.key)">
              {{ element.title }}
            </div>
            <div v-if="element.type === 'divider'" class="w-full ml-8 py-12px flex items-center ">
              <div class="w-full h-[1px] inline-block" :class="[menuMode ? 'bg-white' : 'bg-opacity-20 bg-light-400 w-[12px]']" />
            </div>
            <div class="flex-grow flex items-center justify-end">
              <span
                v-if="menuMode"
                class="px-1 cursor-pointer flex items-center"
                @click="removeMenuItem(element.key)"
              >
                <mdi-delete />
              </span>
              <span
                v-if="menuMode"
                class="mr-2 handle cursor-move flex items-center"
              >
                <mdi-drag />
              </span>
            </div>
          </div>
        </template>
      </draggable>

      <div class="menu-action absolute bottom-0 left-11 py-4 opacity-40 flex justify-start items-center gap-2 hover:(opacity-100)">
        <span class="flex items-center" :class="{ 'text-red-400': menuMode }" @click="changeMenuMode()">
          <mdi-sort class="cursor-pointer" />
        </span>
        <span v-if="menuMode" class="flex items-center" @click="addMenuItem()">
          <mdi-plus class="cursor-pointer" />
        </span>
      </div>
    </div>
    <div class="menu-divider h-full w-[1px] bg-gray-400 bg-opacity-10 flex-shrink-0 flex-grow-0" />
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
    left: 0px;
    top: 4px;
    z-index: 1;
    border-left: 4px solid red;
    height: 2em;
  }
}
</style>
