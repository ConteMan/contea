<script setup lang="ts">
import { puzzling } from '@utils/extend'
import { ConfigModel } from '@models/index'
import BaseService from '@services/weread'

import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
dayjs.extend(Duration)

interface Data {
  loading: boolean
  moduleInfo: Record<string, any>
  config: Record<string, any>
}

const module = 'weread'

const data: Data = reactive({
  loading: true,
  moduleInfo: {},
  config: {},
})
const { loading, moduleInfo, config } = toRefs(data)

// 获取展示数据
const getData = async (refresh = false) => {
  const res = await BaseService.moduleInfo(refresh)
  if (res)
    data.moduleInfo = res
  data.loading = false
}

const getConfig = async () => {
  const res = await ConfigModel.getItem(module)
  if (res)
    data.config = res
}

// 初始化
const init = async () => {
  await getData()
  await getConfig()
}
init()

// 刷新数据
const refresh = async () => {
  data.loading = true
  await getData(true)
  data.loading = false
}

// 最近读书
const recentBooks = computed(() => {
  return moduleInfo.value ? moduleInfo.value.readDetail.datas[0].readMeta.books : {}
})
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 pt-[48px] pl-2 pr-6 flex flex-col items-center gap-4">
      <a class="cursor-pointer flex items-center hover:(cursor-pointer)" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <n-scrollbar v-if="!loading && Object.keys(moduleInfo)" class="sspai-content-container pt-[48px] px-4">
      <div class="mb-12 flex flex-col gap-2">
        <div>
          体验会员：{{ dayjs(moduleInfo.memberCard?.expiredTime * 1000).format('YYYY-MM-DD') }}
        </div>
        <div>
          本周阅读：{{ dayjs.duration(moduleInfo.readDetail.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(moduleInfo.readDetail.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <template v-for="item in recentBooks" :key="item.bookId">
          <div class="py-4 flex flex-col justify-start items-start w-[200px]">
            <div class="mb-4">
              <a :href="`${config.site}/web/reader/${puzzling(item.bookId)}`"><img class="w-full h-full rounded-sm duration-300" :src="item.cover"></a>
            </div>
            <div class="mb-2">
              <a :href="`${config.site}/web/reader/${puzzling(item.bookId)}`">{{ item.title }}</a>
            </div>
            <div>
              {{ item.author }}
            </div>
          </div>
        </template>
      </div>
    </n-scrollbar>
  </div>
</template>
