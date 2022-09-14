<script setup lang="ts">
import BaseService from '@services/one'

interface Data {
  loading: boolean
  list: any[]
}

const data: Data = reactive({
  loading: true,
  list: [],
})
const { loading, list } = toRefs(data)

// 获取展示数据
const getData = async (refresh = false) => {
  const res = await BaseService.list(refresh)
  if (res)
    data.list = res.data
  data.loading = false
}

// 初始化
const init = async () => {
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
    <div class="flex-shrink-0 pt-[48px] pl-2 pr-6 flex flex-col items-center gap-4">
      <a class="cursor-pointer flex items-center hover:(cursor-pointer)" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <n-scrollbar class="sspai-content-container pt-8 pr-4">
      <template v-for="item in list" :key="item.vol">
        <div class="p-4 mb-6 rounded-md hover:(bg-opacity-40)" :style="{ 'background-image': `linear-gradient(-45deg, rgb(229, 231, 231, 0.6), rgb(116, 115, 115, 70%)), url(${item.pic})` }">
          <div>
            <a :href="item.picTextLink">{{ item.date }} / {{ item.vol }} / {{ item.text }}</a>
          </div>
          <div>
            <a :href="item.articleLink" class="cursor-pointer">《{{ item.articleTitle }}》 - {{ item.articleAuthor }}</a>
          </div>
          <div>
            <a :href="item.questionLink" class="cursor-pointer">{{ item.questionTitle }}</a>
          </div>
        </div>
      </template>
    </n-scrollbar>
  </div>
</template>
