<script setup lang="ts">
import type { Ref } from 'vue'
import _ from 'lodash-es'
import draggable from 'vuedraggable'
import { useNewTabState } from '@newTab/store/index'
import Board from '@services/board'

const NewTabStore = useNewTabState()
const { tabSelected, boardMenu } = storeToRefs(NewTabStore)

const changeMenu = (key: string) => {
  NewTabStore.changeTab(key)
}
const activeMenu = tabSelected

const file: Record<string, string> = import.meta.glob('./modules/*.vue', { import: 'default', eager: true })
const paths = Object.keys(file)

const menu: Ref<Module.BoardMenu[]> = ref([])

// 处理菜单数据，绑定组件
const dealMenu = () => {
  const res: any = []

  const components = paths.map((item) => {
    return {
      component: file[item],
      key: item.replace('\.\/modules\/', '').replace('.vue', '').toLowerCase(),
    }
  })
  if (boardMenu.value.length) {
    boardMenu.value.forEach((item) => {
      if (item.type === 'module') {
        const index = components.findIndex(cItem => cItem.key === item.key)
        if (index >= 0 && item.enable) {
          res.push({
            ...components[index],
            ...item,
          })
        }
      }
      else {
        res.push(item)
      }
    })
  }

  menu.value = res
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

const init = async () => {
  await NewTabStore.setBoardMenuByDB()
  dealMenu()
  activeMenu.value = getDefaultKey(Object.values(menu.value), tabSelected.value)
}
init()

watch(() => boardMenu, () => {
  dealMenu()
}, {
  deep: true,
})

watch(() => menu, (newValue) => {
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

// 保存排序后的菜单
const saveMenuSort = async () => {
  const boardMenu = menu.value.map((item) => {
    const { component, ...others } = item
    return others
  })
  await NewTabStore.setBoardMenu(boardMenu)
}

// 菜单模式
const menuMode = ref('')
const changeMenuMode = () => {
  menuMode.value = !menuMode.value ? 'edit' : ''
}

// 添加菜单内容
const addMenuItem = async (type: Store.MenuItemType = 'divider') => {
  await Board.addMenuItem({
    key: `divider-${new Date().getTime()}`,
    type,
    name: '',
  })
  await NewTabStore.setBoardMenuByDB()
}
// 移除菜单内容
const removeMenuItem = async (key: string) => {
  await Board.removeMenuItem(key)
  await NewTabStore.setBoardMenuByDB()
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
        @end="saveMenuSort()"
      >
        <template #item="{ element }">
          <div
            class="menu-item min-w-[160px] select-none flex justify-start items-center"
            :class="{ 'menu-active text-red-600 font-bold': activeMenu === element.key }"
          >
            <div v-if="element.type === 'module'" class="pl-8 py-2 cursor-pointer" @click="changeMenu(element.key)">
              {{ element.name }}
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
