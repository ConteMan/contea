<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { vInfiniteScroll } from '@vueuse/components'
import { TypeEnum } from '@enums/bilibiliEnum'
import { enumToObj } from '@utils/index'
import { ConfigModel } from '@models/index'
import Bilibili from '@services/bilibili'
import type { FeedParam } from '@services/bilibili/model'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'

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
  if (refresh) {
    data.offset = undefined
    data.page = 1
  }

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
    data.list = [...data.list, ...content.items]

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

// 加载更多
const loadMore = async () => {
  if (data.hasMore) {
    data.page++
    await getData()
  }
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
  <WorldlineContent>
    <template #bar>
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
      <div class="h-[30%] mx-4 border-l border-l-gray-400 opacity-20" />
      <template v-for="item in data.moduleTypes" :key="item.key">
        <div
          class="py-2 px-2 cursor-pointer opacity-60"
          :class="[selectedType === item.value ? 'text-red-500 !opacity-100' : '']"
          @click="selectModuleType(item.value)"
        >
          {{ item.key }}
        </div>
      </template>
    </template>

    <template #content>
      <div
        v-infinite-scroll="[loadMore, { distance: 10 }]"
        class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4"
      >
        <template v-for="item in list" :key="item.id_str">
          <div class="p-4 rounded-md bg-gray-400 bg-opacity-20 hover:(bg-opacity-40)">
            <div class="max-w-[1080px] flex flex-col">
              <div class="pb-3">
                <template v-if="item.type === 'DYNAMIC_TYPE_LIVE_RCMD'">
                  <a :href="liveInfo(item.modules.module_dynamic.major.live_rcmd.content).live_play_info.link">{{ liveInfo(item.modules.module_dynamic.major.live_rcmd.content).live_play_info.title }}</a>
                </template>
                <template v-if="['DYNAMIC_TYPE_DRAW', 'DYNAMIC_TYPE_FORWARD'].includes(item.type) && item.modules.module_dynamic.desc?.text">
                  <a :href="`${config.tSite}/${item.id_str}`"><div v-html="contentDeal(item.modules.module_dynamic.desc.text)" /></a>
                </template>
                <template v-if="['DYNAMIC_TYPE_AV'].includes(item.type)">
                  <a :href="`https:${item.modules.module_dynamic.major.archive.jump_url}`">{{ item.modules.module_dynamic.major.archive.title }}</a>
                </template>
              </div>
              <div
                v-if="item.modules.module_dynamic.major?.draw?.items"
                class="pb-6 max-w-[600px] flex justify-start items-center flex-wrap gap-2"
              >
                <div
                  v-for="drawItem in item.modules.module_dynamic.major.draw.items" :key="drawItem.src"
                  :style="{ backgroundImage: `url(${drawItem.src})` }"
                  class="w-[180px] h-[180px] rounded-md bg-cover"
                />
              </div>
              <!-- 转发原文 -->
              <div
                v-if="['DYNAMIC_TYPE_FORWARD'].includes(item.type)"
                class="border-l border-l-8 border-gray-800 border-opacity-60 p-4 mb-6"
              >
                <div class="pb-3 max-w-[1080px]">
                  <template v-if="item.orig.type === 'DYNAMIC_TYPE_LIVE_RCMD'">
                    <a :href="liveInfo(item.orig.modules.module_dynamic.major.live_rcmd.content).live_play_info.link">{{ liveInfo(item.orig.modules.module_dynamic.major.live_rcmd.content).live_play_info.title }}</a>
                  </template>
                  <template v-if="['DYNAMIC_TYPE_DRAW', 'DYNAMIC_TYPE_FORWARD'].includes(item.orig.type) && item.orig.modules.module_dynamic.desc?.text">
                    <a :href="`${config.tSite}/${item.orig.id_str}`"><div v-html="contentDeal(item.orig.modules.module_dynamic.desc.text)" /></a>
                  </template>
                  <template v-if="['DYNAMIC_TYPE_AV'].includes(item.orig.type)">
                    <a :href="`https:${item.orig.modules.module_dynamic.major.archive.jump_url}`">{{ item.orig.modules.module_dynamic.major.archive.title }}</a>
                  </template>
                </div>
                <div
                  v-if="item.orig.modules.module_dynamic.major?.draw?.items"
                  class="pb-6 flex justify-start items-center flex-wrap gap-2"
                >
                  <div
                    v-for="drawItem in item.orig.modules.module_dynamic.major.draw.items" :key="drawItem.src"
                    :style="{ backgroundImage: `url(${drawItem.src})` }"
                    class="w-[180px] h-[180px] rounded-md bg-cover"
                  />
                </div>
                <div class="text-[12px]">
                  {{ item.orig.modules.module_author.name }}
                </div>
              </div>
              <div class="text-[12px]">
                {{ item.modules.module_author.name }} {{ actionText(item.type, item.modules.module_author.pub_action) }} / {{ timeText(item.type, item.modules.module_author.pub_time, item.type === 'DYNAMIC_TYPE_LIVE_RCMD' ? item.modules.module_dynamic.major.live_rcmd.content : undefined) }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </WorldlineContent>
</template>
