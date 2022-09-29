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

  recentPage: number
  recentPageSize: number

  showArchive: boolean
  currentArchive: Record<string, any>
  archivePageSize: number
  archivePage: number
}

const module = 'weread'

const data: Data = reactive({
  loading: true,
  moduleInfo: {},
  config: {},

  recentPage: 1,
  recentPageSize: 5,

  showArchive: false,
  currentArchive: {},
  archivePage: 1,
  archivePageSize: 10,
})
const { loading, moduleInfo, config, showArchive, currentArchive } = toRefs(data)

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
  await getConfig()
  await getData()
}
init()

// 刷新数据
const refresh = async () => {
  data.loading = true
  await getData(true)
  data.loading = false
}

// 最近阅读
const recentBooks = computed(() => {
  const books: Record<string, any>[] = moduleInfo.value ? moduleInfo.value.shelf.rawBooks : []
  return books.slice(0, data.recentPage * data.recentPageSize)
})

// 最近阅读是否存在更多
const recentHasMore = computed(() => {
  return moduleInfo.value.shelf.rawBooks ? (data.archivePage * data.archivePageSize < moduleInfo.value.shelf.rawBooks.length) : false
})

// 分组加载更多动作
const recentLoadMore = () => {
  if (recentHasMore.value)
    data.recentPage++
}

// 重置最近阅读数据
const recentReset = () => {
  data.recentPage = 1
}

// 处理书籍封面图片
const dealCover = (url: string) => {
  return /\/s_/.test(url) ? url.replace('/s_', '/t6_') : url
}

// 书架
const shelf = computed(() => {
  return moduleInfo.value ? moduleInfo.value.shelf.booksAndArchives : []
})

// 选中分组的图书
const archiveShowBooks = computed(() => {
  return currentArchive.value ? (currentArchive.value.allBooks).slice(0, (data.archivePage * data.archivePageSize)) : []
})

// 分组存在未加载数据标识
const archiveHasMore = computed(() => {
  return currentArchive.value ? (data.archivePage * data.archivePageSize < currentArchive.value.allBooks.length) : false
})

// 分组加载更多动作
const archiveLoadMore = () => {
  if (archiveHasMore.value)
    data.archivePage++
}

// 重置分组数据
const archiveReset = () => {
  data.archivePage = 1
  data.currentArchive = {}
  data.showArchive = false
}

// 选择分组
const selectArchive = (archiveId: number) => {
  const archiveIndex = moduleInfo.value.shelf.archive.findIndex((item: any) => {
    return item.archiveId === archiveId
  })
  if (archiveIndex >= 0) {
    data.currentArchive = moduleInfo.value.shelf.archive[archiveIndex]
    data.showArchive = true
  }
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <div
      v-if="!loading && Object.keys(moduleInfo)"
      class="hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-8"
    >
      <div class="max-w-[1080px] p-6 rounded-md bg-gray-400 bg-opacity-20 flex flex-col gap-2">
        <div>
          本周阅读：{{ dayjs.duration(moduleInfo.readDetail.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(moduleInfo.readDetail.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins
        </div>
      </div>

      <div class="max-w-[1080px] p-6 rounded-md bg-gray-400 bg-opacity-20">
        <div class="pb-4 font-bold">
          <span class="cursor-pointer" @click="recentReset()">最近阅读</span>
        </div>
        <div class="flex flex-wrap gap-x-22 gap-y-8">
          <template v-for="item in recentBooks" :key="item.bookId">
            <div class="flex flex-col justify-start items-start w-[128px]">
              <a :href="`${config.site}/web/reader/${puzzling(item.bookId)}`">
                <div class="w-[128px] h-[185px] mb-4 rounded-sm bg-cover" :style="{ backgroundImage: `url(${dealCover(item.cover)})` }" />
                <div class="ellipsis-2 mb-2 max-h-[44.8px] overflow-hidden overflow-ellipsis" :title="item.title">
                  {{ item.title }}
                </div>
                <div class="text-[12px]">
                  {{ item.author }}
                </div>
              </a>
            </div>
          </template>
          <div
            v-if="recentHasMore"
            class="text-[16px] font-bold cursor-pointer flex flex-col justify-center items-start w-[128px]"
            @click="recentLoadMore()"
          >
            More ...
          </div>
        </div>
      </div>

      <div class="max-w-[1080px] p-6 rounded-md bg-gray-400 bg-opacity-20">
        <div class="pb-4">
          <span class="cursor-pointer font-bold" @click="archiveReset()">书架</span>
          <template v-if="showArchive">
            <span class="px-4">/</span>
            <span>{{ currentArchive.name }}</span>
          </template>
        </div>
        <div class="flex flex-wrap gap-x-22 gap-y-8">
          <template v-if="!showArchive">
            <template v-for="item in shelf" :key="item.bookId ?? item.archiveId">
              <div class="flex flex-col justify-start items-start w-[128px]">
                <template v-if="item.type === 'book'">
                  <a :href="`${config.site}/web/reader/${puzzling(item.bookId)}`">
                    <div class="w-[128px] h-[185px] mb-4 rounded-sm bg-cover" :style="{ backgroundImage: `url(${dealCover(item.cover)})` }" />
                    <div class="mb-2 ellipsis-2 max-h-[44.8px] overflow-hidden overflow-ellipsis" :title="item.title">
                      {{ item.title }}
                    </div>
                    <div class="text-[12px]">
                      {{ item.author }}
                    </div>
                  </a>
                </template>
                <template v-if="item.type === 'archive'">
                  <div
                    class="h-[185px] mb-4 inline-grid grid-cols-2 grid-cols-2 gap-1"
                    @click="selectArchive(item.archiveId)"
                  >
                    <img
                      v-for="aItem in (item.allBooks).slice(0, 4)" :key="aItem.bookId"
                      :src="aItem.cover"
                      class="rounded-sm object-fill"
                    >
                  </div>
                  <div class="mb-2 ellipsis-2 max-h-[44.8px] overflow-hidden overflow-ellipsis" :title="item.name">
                    {{ item.name }}
                  </div>
                </template>
              </div>
            </template>
          </template>
          <template v-if="showArchive && currentArchive">
            <template v-for="cItem in archiveShowBooks" :key="cItem.bookId">
              <div class="flex flex-col justify-start items-start w-[128px]">
                <a :href="`${config.site}/web/reader/${puzzling(cItem.bookId)}`">
                  <div class="w-[128px] h-[185px] mb-4 rounded-sm bg-cover" :style="{ backgroundImage: `url(${dealCover(cItem.cover)})` }" />
                  <div class="ellipsis-2 mb-2 max-h-[44.8px] overflow-hidden overflow-ellipsis" :title="cItem.title">
                    {{ cItem.title }}
                  </div>
                  <div class="text-[12px]">
                    {{ cItem.author }}
                  </div>
                </a>
              </div>
            </template>
            <div
              v-if="archiveHasMore"
              class="text-[16px] font-bold cursor-pointer flex flex-col justify-center items-start w-[128px]"
              @click="archiveLoadMore()"
            >
              More ...
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
