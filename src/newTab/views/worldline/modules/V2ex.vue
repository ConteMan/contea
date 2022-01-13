<template>
  <div ref="listContainerRef">
    <div class="tags absolute w-full bg-white pb-2 pl-2">
      <template v-for="item in baseTypes" :key="item.key">
        <a-checkable-tag
          :checked="selectedTags.indexOf(item.value) > -1"
          @change="checked => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </a-checkable-tag>
      </template>
    </div>
    <div class="mt-8 mb-4">
      <template v-for="item in list" :key="item.title">
        <div class="p-2 rounded-sm  hover:(bg-gray-200)">
          <a :href="'https://v2ex.com' + item.title_link">
            {{ item.title }}
          </a>
          <span class="text-xs text-gray-300 ml-2">
            {{ dayjs(item.ca_sort_at).format('MM-DD HH:mm') }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Base from '~/services/base'
import { TypeEnum } from '~/enums/v2exEnum'
import { enumToObj } from '~/utils'

const state = reactive({
  baseTypes: {} as any,
  selectedTags: ['tab-all'] as string[],
  list: [] as any[],
})
const { selectedTags, list, baseTypes } = toRefs(state)
const listContainerRef = ref()

const getPage = async() => {
  const res = await Base.listByModule({ currentPage: 1, num: 20 }, 'v2ex', toRaw(selectedTags.value))
  list.value = res
}
getPage()

// 获取栏目类型
const getTypes = () => {
  const res: any = enumToObj(TypeEnum, ['value', 'key'])
  res.map((item: any) => {
    item.value = `tab-${item.value}`
    return item
  })
  baseTypes.value = res
}
getTypes()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  const { selectedTags } = state
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter(t => t !== tag)
  state.selectedTags = nextSelectedTags
  getPage()
}

</script>

<style>
</style>
