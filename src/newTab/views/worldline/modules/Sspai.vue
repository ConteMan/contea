<script setup lang="ts">
import { TypeEnum } from '@enums/sspaiEnum'
import { enumToObj } from '@utils/index'
import { ConfigModel } from '@models/index'
import Base from '@services/base'
import Alarm from '@services/base/alarm'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import RelativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(RelativeTime)

const module = 'sspai'

const data = reactive({
  loading: false,
  config: {} as any,
  moduleTypes: {} as any,
  selectedTags: [] as string[],
  list: [] as any[],
})
const { config, loading, selectedTags, list } = toRefs(data)

// 列表数据
const getData = async () => {
  data.list = await Base.listByModule({ currentPage: 1, num: 100 }, module, toRaw(selectedTags.value))
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

// 选择标签
const clickTab = async (tag: string) => {
  const { selectedTags } = data
  const nextSelectedTags = selectedTags.includes(tag)
    ? selectedTags.filter(t => t !== tag)
    : [...selectedTags, tag]
  data.selectedTags = nextSelectedTags
  // eslint-disable-next-line no-console
  console.log(tag, nextSelectedTags)
  await getData()
}

// 刷新数据
const refresh = async () => {
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

// 图片处理
const banner = (type: string, item: Record<string, any>) => {
  let bannerUrl = ''
  if (type === 'followActivity' && item.data.data.banner)
    bannerUrl = item.data.data.banner
  if (['index', 'matrix'].includes(type) && item.data.banner)
    bannerUrl = item.data.banner
  if (!bannerUrl)
    return ''
  return `https://cdn.sspai.com/${bannerUrl}?imageMogr2/auto-orient/quality/95/thumbnail/!400x200r/gravity/Center/crop/800x400/interlace/1`
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <div
        v-for="item in data.moduleTypes" :key="item.value"
        class="py-2 px-4 cursor-pointer"
        :class="{ 'text-red-500 font-bold': selectedTags.includes(item.value) }"
        @click="clickTab(item.value)"
      >
        {{ item.key }}
      </div>
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <div class="sspai-content hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-4">
      <div
        v-for="item in list" :key="item.title"
        class="max-w-[800px] min-h-[132px] p-4 rounded-md shadow-current bg-gray-400 bg-opacity-20 flex gap-6 hover:(bg-opacity-40)"
      >
        <div class="flex-grow flex flex-col justify-center items-start gap-6">
          <div class="text-[15px] font-bold">
            <template v-if="['index', 'matrix'].includes(item.ca_module_type)">
              <a :href="`${config.site}/post/${item.ca_data_id}`">
                {{ item.data.title }}
              </a>
            </template>
            <template v-if="['followActivity'].includes(item.ca_module_type)">
              <template v-if="['like_article', 'release_article'].includes(item.data.key)">
                <a :href="`${config.site}/post/${item.ca_data_id}`">
                  {{ item.data.data.title }}
                </a>
              </template>
            </template>
          </div>

          <div class="text-[13px] flex gap-2">
            <template v-if="['index', 'matrix'].includes(item.ca_module_type)">
              <a :href="`${config.site}/u/${item.data.author.slug}/updates`">{{ item.data.author.nickname }}</a>
              <template v-if="item.data.is_matrix">
                <span>/</span>
                <span>
                  MATRIX
                </span>
              </template>
            </template>
            <template v-if="['followActivity'].includes(item.ca_module_type)">
              <a :href="`${config.site}/u/${item.data.author.slug}/updates`">{{ item.data.author.nickname }}</a> {{ transformAction(item.data.key) }}
              <span>/</span>
              <a :href="`${config.site}/u/${item.data.author.slug}/updates`">{{ item.data.author.nickname }}</a>
            </template>
            <span>/</span>
            <span>
              {{ dayjs(item.ca_sort_at).fromNow() }}
            </span>
          </div>
        </div>

        <div class="flex-grow-0 flex items-center">
          <img v-if="banner(item.ca_module_type, item)" class=" w-[160px] h-[100px] rounded-md" :src="banner(item.ca_module_type, item)">
        </div>
      </div>
    </div>
  </div>
</template>
