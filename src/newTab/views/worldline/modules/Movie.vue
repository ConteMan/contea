<script setup lang="ts">
import BaseService from '@services/movie'
import { ConfigModel } from '@models/index'

const module = 'movie'

interface Data {
  loading: boolean
  list: any[]
  config: Record<string, any>
}

const data: Data = reactive({
  loading: true,
  list: [],
  config: {},
})
const { loading, list } = toRefs(data)

// 获取展示数据
const getData = async (refresh = false) => {
  const res = await BaseService.getList('libvio', refresh)
  if (res)
    data.list = res.data
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
  data.loading = true
  await getData(true)
  data.loading = false
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <div class="hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-4">
      <template v-for="item in list" :key="item.vol">
        <div class="p-4 rounded-md shadow-current bg-gray-400 bg-opacity-20 flex gap-8 hover:(bg-opacity-40)">
          <a :href="item.url">
            <img :src="item.pic_url" class="h-full max-h-[160px] rounded-md">
          </a>
          <div class="max-w-[720px] flex flex-col justify-start items-start gap-2">
            <div>
              <a :href="item.url" class="cursor-pointer">《{{ item.title }}》</a>
            </div>
            <div>
              <span v-if="item.desc">{{ item.tag }} / </span> {{ item.desc }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

