<script setup lang="ts">
import BaseService from '@services/movie'
import { ConfigModel } from '@models/index'

const module = 'movie'

interface Data {
  loading: string | false
  list: any[]
  config: Record<string, any>
}

const data: Data = reactive({
  loading: 'get-data',
  list: [],
  config: {},
})
const { loading, list } = toRefs(data)

// 获取展示数据
const getData = async (refresh = false) => {
  const res = await BaseService.getList('libvio', refresh)
  if (res)
    data.list = res
  data.loading = false
}

// 初始化
const init = async () => {
  data.config = await ConfigModel.getItem(module)
  await getData()
}
init()

// 刷新数据
const refresh = async () => {
  data.loading = 'get-data'
  await getData(true)
  data.loading = false
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <a class="py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading === 'get-data' }" />
      </a>
    </div>

    <div class="hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-4">
      <template v-for="item in list" :key="item.url">
        <div class="p-4 rounded-md shadow-current bg-gray-400 bg-opacity-20 flex gap-8 hover:(bg-opacity-40)">
          <a :href="item.url">
            <img :src="item.pic_url" class="h-full max-h-[160px] rounded-md">
          </a>
          <div class="max-w-[720px] flex flex-col justify-start items-start gap-2">
            <div>
              <a :href="item.url" class="cursor-pointer">《{{ item.title }}》</a>
            </div>
            <div class="flex items-center gap-2">
              <a v-if="item.doubanId && item.doubanUrl" :href="item.doubanUrl" class="flex items-center">
                <mdi-douban />
              </a>
              <span v-if="item.doubanId && item.doubanUrl">/</span>
              <span v-if="item.desc">{{ item.tag }}</span>
              <span v-if="item.desc">/</span>
              <span>{{ item.desc }}</span>
            </div>
            <template v-if="item.detailArr">
              <div v-for="dItem, dIndex in item.detailArr" :key="dIndex">
                {{ dItem }}
              </div>
            </template>
            <div v-if="item.detailStr" v-html="item.detailStr" />
            <div v-if="item.updatedAt">
              更新于：{{ item.updatedAt }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

