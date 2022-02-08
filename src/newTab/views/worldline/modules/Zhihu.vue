<template>
  <div class="sspai-scroll-container">
    <div class="tags absolute w-full bg-white pb-2 pl-2">
      <a class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': loading }" />
      </a>
      <template v-for="item in moduleTypes" :key="item.key">
        <a-checkable-tag
          :checked="selectedTag === item.value"
          @change="checked => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </a-checkable-tag>
      </template>
    </div>

    <div class="mt-8 mb-4">
      <ListItem v-for="item in list" :key="item.id" :data="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { enumToObj } from '~/utils'

import ListItem from '~/components/zhihu/components/ListItem.vue'

import type { Config } from '~/services/zhihu/model'
import { TypeEnum } from '~/enums/zhihuEnum'
import Base from '~/services/zhihu'
import configState from '~/models/keyValue/configState'

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
