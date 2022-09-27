<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components'
import BaseService from '@services/movie'
import { ConfigModel } from '@models/index'

const module = 'movie'

interface Data {
  loading: string | false
  list: any[]
  config: Record<string, any>

  page: number
  pageSize: number
  hasMore: boolean
}

const data: Data = reactive({
  loading: 'get-data',
  list: [],
  config: {},

  page: 1,
  pageSize: 10,
  hasMore: true,
})
const { loading, list, page, pageSize, hasMore } = toRefs(data)

// 获取展示数据
const getData = async () => {
  const res = await BaseService.movieList({
    page: page.value,
    pageSize: pageSize.value,
  })
  if (res) {
    data.list = [...data.list, ...res]
    if (res.length < pageSize.value)
      data.hasMore = false
  }
  else {
    data.hasMore = false
  }
  data.loading = false
}

// 初始化
const init = async () => {
  data.config = await ConfigModel.getItem(module)
  await getData()
}
init()

// 重置列表条件
const resetList = async () => {
  data.page = 1
  data.hasMore = true
}

// 刷新数据
const refresh = async () => {
  data.loading = 'get-data'
  resetList()
  await BaseService.getList('libvio', true)
  await getData()
  data.loading = false
}

// 加载更多
const loadMore = async () => {
  if (hasMore.value) {
    data.page++
    await getData()
  }
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading === 'get-data' }" />
      </a>
    </div>

    <div
      v-infinite-scroll="[loadMore, { distance: 10 }]"
      class="hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-4"
    >
      <template v-for="item in list" :key="item.id">
        <template v-if="item.source === 'libvio'">
          <div class="max-w-[1080px] p-4 rounded-md bg-gray-400 bg-opacity-20 flex gap-8 hover:(bg-opacity-40)">
            <a :href="item.libvio_data.url">
              <img :src="item.libvio_data.pic_url" class="h-full max-w-[180px] rounded-md object-cover">
            </a>
            <div class="flex flex-col justify-start items-start gap-2">
              <div>
                <a :href="item.libvio_data.url" class="cursor-pointer">《{{ item.libvio_data.title }}》</a>
              </div>
              <div class="flex items-center gap-2">
                <a v-if="item.libvio_data.douban_url" :href="item.libvio_data.douban_url" class="flex items-center">
                  <mdi-douban />
                </a>
                <span v-if="item.douban_url">/</span>
                <span v-if="item.libvio_data.tag">{{ item.libvio_data.tag }}</span>
                <span v-if="item.libvio_data.tag">/</span>
                <span>{{ item.libvio_data.desc }}</span>
              </div>
              <template v-if="item.libvio_data.detail_arr">
                <div v-for="dItem, dIndex in item.libvio_data.detail_arr" :key="dIndex" v-html="dItem.replace('/', '<br>')" />
              </template>
              <div v-if="item.libvio_data.detail_str" v-html="item.libvio_data.detail_str" />
              <div v-if="item.libvio_data.updated_at">
                更新于：{{ item.libvio_data.updated_at }}
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

