<template>
  <div class="v2ex-scroll-container">
    <a-back-top :target="getTarget" :visibility-height="500">
      <span class="text-size-2xl opacity-70 hover:(opacity-100)">
        <ic-outline-keyboard-arrow-up />
      </span>
    </a-back-top>
    <div class="tags absolute w-full bg-white pb-2 pl-2">
      <span class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': data.loading>0}" />
      </span>
      <template v-for="item in moduleTypes" :key="item.key">
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
import Alarm from '~/services/base/alarm'

const module = 'v2ex'

const data = reactive({
  loading: 0,
  moduleTypes: {} as any,
  selectedTags: [] as string[],
  list: [] as any[],
})
const { selectedTags, list, moduleTypes } = toRefs(data)

// 获取列表数据
const getPage = async() => {
  data.list = await Base.listByModule({ currentPage: 1, num: 100 }, module, toRaw(selectedTags.value))
}
getPage()

// 获取类型数据
const getTypes = () => {
  const res: any = enumToObj(TypeEnum, ['value', 'key'])
  res.map((item: any) => {
    item.value = `tab-${item.value}`
    return item
  })
  moduleTypes.value = res
}
getTypes()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  const { selectedTags } = data
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter(t => t !== tag)
  data.selectedTags = nextSelectedTags
  getPage()
}

// 刷新
const refresh = async() => {
  data.loading++
  await Alarm.alarmDeal(module)
  await getPage()
  data.loading--
}
</script>

<script lang="ts">
export default {
  methods: {
    getTarget() {
      return document.querySelector('.v2ex-scroll-container') as HTMLElement
    },
  },
}
</script>

<style>
.ant-back-top {
  left: 1rem;
  bottom: 1rem;
}
</style>
