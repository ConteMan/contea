<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { TypeEnum } from '@enums/bilibiliEnum'
import { enumToObj } from '@utils/index'
import ConfigModel from '@models/config'
import Bilibili from '@services/bilibili'
import type { FeedParam } from '@services/bilibili/model'

dayjs.locale('zh-cn')
dayjs.extend(RelativeTime)

const module = 'bilibili'

interface Data {
  loading: boolean

  config: Record<string, any>
  moduleTypes: Record<string, any>
  selectedType: string

  hasMore: boolean

  page: FeedParam['page']
  timezoneOffset: FeedParam['timezone_offset']
  offset: FeedParam['offset']

  list: any[]
}

const data: Data = reactive({
  loading: true,

  config: {},
  moduleTypes: {},
  selectedType: 'DYNAMIC',

  hasMore: true,
  page: 1,
  timezoneOffset: -480,
  offset: undefined,

  list: [],
})
const { loading, config, selectedType, list } = toRefs(data)

// 动态数据
const getDynamic = async (refresh = false) => {
  const res = await Bilibili.feed({
    type: 'all',
    page: data.page,
    timezone_offset: data.timezoneOffset,
    offset: data.offset,
  })
  if (!res) {
    data.loading = false
    return
  }

  const content = res.data.data
  data.hasMore = content.has_more
  data.offset = content.offset ?? ''

  if (refresh)
    data.list = content.items
  else
    data.list = [...content.items, ...data.list]

  data.loading = false
}

// 获取展示数据
const getData = async (refresh = false) => {
  if (selectedType.value === 'DYNAMIC')
    await getDynamic(refresh)
}

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(TypeEnum, ['value', 'key'])
}

// 初始化
const init = async () => {
  data.config = await ConfigModel.getItem(module)
  getTypes()
  await getData()
}
init()

// 不同类型初始化
const moduleTypeInit = (type: string) => {
  if (type === 'DYNAMIC') {
    data.hasMore = true
    data.offset = undefined
    data.list = []
  }
}

// 选择类型
const selectModuleType = async (type: string) => {
  data.selectedType = type
  moduleTypeInit(type)
  await getData(true)
}

// 刷新数据
const refresh = async () => {
  data.loading = true
  moduleTypeInit(data.selectedType)
  await getData(true)
  data.loading = false
}

// 直播信息
const liveInfo = (data: string) => {
  return JSON.parse(data)
}

// 动作描述
const actionText = (type: string, desc: string) => {
  if (desc)
    return desc
  if (type === 'DYNAMIC_TYPE_FORWARD')
    return '转发'
  return '发布'
}

// 时间描述
const timeText = (type: string, desc: string, liveData?: string) => {
  if (desc)
    return desc
  if (type === 'DYNAMIC_TYPE_LIVE_RCMD' && liveData) {
    const liveDataFormat = JSON.parse(liveData)
    return dayjs(liveDataFormat.live_play_info.live_start_time * 1000).fromNow()
  }
  return ''
}

// 内容处理
const contentDeal = (content: string) => {
  return content.replace(/\n/gi, '<br>')
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 pt-[48px] pl-2 pr-6 flex flex-col items-center gap-4">
      <template v-for="item in data.moduleTypes" :key="item.key">
        <div
          class="h-auto cursor-pointer"
          :class="[selectedType === item.value ? 'text-red-500 font-bold' : '']"
          @click="selectModuleType(item.value)"
        >
          {{ item.key }}
        </div>
      </template>
      <div class="w-[80%] h-[1px] my-2 bg-light-400 bg-opacity-40" />
      <a class="cursor-pointer flex items-center hover:(cursor-pointer)" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <n-scrollbar class="sspai-content-container pt-8 pr-4">
      <template v-for="item in list" :key="item.id_str">
        <div class="py-4 pb-6 px-4 rounded-md hover:(bg-red-400 bg-opacity-40)">
          <div class="pb-3">
            <template v-if="item.type === 'DYNAMIC_TYPE_LIVE_RCMD'">
              <a :href="liveInfo(item.modules.module_dynamic.major.live_rcmd.content).live_play_info.link">{{ liveInfo(item.modules.module_dynamic.major.live_rcmd.content).live_play_info.title }}</a>
            </template>
            <template v-if="['DYNAMIC_TYPE_DRAW', 'DYNAMIC_TYPE_FORWARD'].includes(item.type)">
              <a :href="`${config.tSite}/${item.id_str}`"><div v-html="contentDeal(item.modules.module_dynamic.desc.text)" /></a>
            </template>
            <template v-if="['DYNAMIC_TYPE_AV'].includes(item.type)">
              <a :href="`https:${item.modules.module_dynamic.major.archive.jump_url}`">{{ item.modules.module_dynamic.major.archive.title }}</a>
            </template>
          </div>
          <div class="text-[12px] text-light-600 text-opacity-60">
            {{ item.modules.module_author.name }} {{ actionText(item.type, item.modules.module_author.pub_action) }} / {{ timeText(item.type, item.modules.module_author.pub_time, item.type === 'DYNAMIC_TYPE_LIVE_RCMD' ? item.modules.module_dynamic.major.live_rcmd.content : undefined) }}
          </div>
        </div>
      </template>
    </n-scrollbar>
  </div>
</template>
