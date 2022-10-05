<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components'
import { ConfigModel } from '@models/index'
import BaseService from '@services/movie'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'

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
  <WorldlineContent>
    <template #bar>
      <a class="cursor-pointer flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading === 'get-data' }" />
      </a>
    </template>

    <template #content>
      <div
        v-infinite-scroll="[loadMore, { distance: 10 }]"
        class="h-full overflow-y-auto hover-scroll pr-8 flex flex-col gap-4"
      >
        <template v-for="item in list" :key="item.id">
          <template v-if="item.source === 'libvio' && !/.*上线.*/.test(item.libvio_data.desc)">
            <div class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex gap-8 hover:(bg-opacity-40)">
              <a :href="item.libvio_data.url">
                <img :src="item.libvio_data.pic_url" class="h-full max-w-[180px] rounded-md object-cover">
              </a>
              <div class="flex flex-col justify-start items-start gap-2">
                <div>
                  <a :href="item.libvio_data.url" class="cursor-pointer">《{{ item.libvio_data.title }}》</a>
                </div>
                <div class="flex items-center gap-2">
                  <a v-if="item.libvio_data.douban_url" :href="item.libvio_data.douban_url" class="flex items-center text-green-600">
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
                <div v-if="item.libvio_data.detail_str" class="break-all" v-html="item.libvio_data.detail_str" />
                <div v-if="item.libvio_data.updated_at">
                  更新于：{{ item.libvio_data.updated_at }}
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
  </WorldlineContent>
</template>

