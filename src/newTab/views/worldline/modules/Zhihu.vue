<template>
  <div class="flex flex-col">
    <div class="w-full pb-2 pl-2">
      <a class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': loading }" />
      </a>
      <template v-for="item in moduleTypes" :key="item.key">
        <n-tag
          class="mr-2 text-xs h-auto py-0.8"
          checkable
          :checked="selectedTag === item.value"
          @update:checked="checked => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </n-tag>
      </template>
    </div>

    <n-scrollbar class="jike-content-container">
      <n-back-top :right="10000" :bottom="8" to=".jike-content-container" class="left-3 text-xl text-gray-400 shadow-none bg-transparent hover:(shadow-none text-[#fd2720])">
        <bx-bx-arrow-to-top />
      </n-back-top>
      <ListItem v-for="item in list" :key="item.id" :data="item" />
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import configState from '@models/keyValue/configState'
import { enumToObj } from '@utils/index'

import type { Config } from '@services/zhihu/model'
import Base from '@services/zhihu'
import { TypeEnum } from '@enums/zhihuEnum'
import ListItem from '@newTab/components/zhihu/components/ListItem.vue'

const module = 'zhihu'
const defaultType = 'hot'

const data = reactive({
  loading: true,
  config: {} as Config,
  moduleTypes: {} as any,
  selectedTag: defaultType,
  list: [] as any[],
})
const { loading, moduleTypes, selectedTag, list } = toRefs(data)

// 列表数据
const getList = async(refresh = false, limit = 50) => {
  if (selectedTag.value === 'hot') {
    const res = await Base.hot({ limit }, refresh)
    data.list = res.data
  }
  data.loading = false
}

const init = async() => {
  data.config = await configState.getItem(module)
  getList()
}
init()

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(TypeEnum, ['value', 'key'])
}
getTypes()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  data.selectedTag = checked ? tag : defaultType
  getList()
}

// 刷新数据
const refresh = async() => {
  data.loading = true
  await getList(true)
  data.loading = false
}
</script>
