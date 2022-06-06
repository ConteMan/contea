<template>
  <div class="w-full flex flex-col">
    <div class="w-full pb-3 pl-2">
      <a class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': loading}" />
      </a>
      <template v-for="item in data.moduleTypes" :key="item.key">
        <n-tag
          class="mr-2 text-xs h-auto py-0.8"
          checkable
          :checked="selectedTags.indexOf(item.value) > -1"
          @update:checked="(checked: boolean) => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </n-tag>
      </template>
    </div>

    <n-scrollbar class="sspai-content-container">
      <n-back-top :right="10000" :bottom="8" to=".sspai-content-container" class="left-1 text-xl text-gray-400 shadow-none hover:(shadow-none text-[#fd2720])">
        <bx-bx-arrow-to-top />
      </n-back-top>
      <template v-for="item in list" :key="item.title">
        <div class="p-2 rounded-sm">
          <template v-if="item.ca_module_type === 'followActivity'">
            <template v-if="['like_article', 'release_article'].includes(item.key)">
              <a :href="`${config.site}/post/${item.data.id}`">
                {{ item.data.title }}
              </a>
            </template>
          </template>
          <template v-if="['index', 'matrix'].includes(item.ca_module_type)">
            <a :href="`${config.site}/post/${item.id}`">
              {{ item.title }}
            </a>
          </template>
          <div class="text-xs py-1 text-gray-300">
            <span v-if="item.ca_module_type === 'followActivity'">
              <a :href="`${config.site}/u/${item.author.slug}/updates`">{{ item.author.nickname }}</a> {{ transformAction(item.key) }} / <a :href="`${config.site}/u/${item.data.author.slug}/updates`">{{ item.data.author.nickname }}</a> /
            </span>
            <template v-if="['index', 'matrix'].includes(item.ca_module_type)">
              <span>
                <a :href="`${config.site}/u/${item.author.slug}/updates`">{{ item.author.nickname }}</a> /
              </span>
              <span v-if="item.is_matrix">
                MATRIX /
              </span>
            </template>
            <span class="pl-1">
              {{ dayjs(item.ca_sort_at).fromNow() }}
            </span>
          </div>
        </div>
      </template>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import RelativeTime from 'dayjs/plugin/relativeTime'
import configState from '@models/keyValue/configState'
import { enumToObj } from '@utils/index'
import Base from '@services/base'
import Alarm from '@services/base/alarm'
import { TypeEnum } from '@enums/sspaiEnum'

const module = 'sspai'

dayjs.locale('zh-cn')
dayjs.extend(RelativeTime)

const data = reactive({
  loading: false,
  config: {} as any,
  moduleTypes: {} as any,
  selectedTags: [] as string[],
  list: [] as any[],
})
const { config, loading, selectedTags, list } = toRefs(data)

// 列表数据
const getData = async() => {
  data.list = await Base.listByModule({ currentPage: 1, num: 100 }, module, toRaw(selectedTags.value))
}

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(TypeEnum, ['value', 'key'])
}

// 初始化
const init = async() => {
  data.config = await configState.getItem(module)
  getTypes()
  await getData()
}
init()

// 选择标签
const handleChange = async(tag: string, checked: boolean) => {
  const { selectedTags } = data
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter(t => t !== tag)
  data.selectedTags = nextSelectedTags
  await getData()
}

// 刷新数据
const refresh = async() => {
  data.loading = true
  await Alarm.dealAlarm(module)
  await getData()
  data.loading = false
}

// 动作描述转换
const transformAction = (action: string) => {
  if (action === 'like_article')
    return '喜欢'
  if (action === 'release_article')
    return '发布'
}
</script>
