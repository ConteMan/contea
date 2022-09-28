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
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <div class="hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-4">
      <template v-for="item in list" :key="item.vol">
        <div class="max-w-[1080px] p-4 rounded-md shadow-current bg-gray-400 bg-opacity-20 flex gap-8 hover:(bg-opacity-40)">
          <a :href="item.picTextLink">
            <img :src="item.pic" class="h-full max-h-[160px] rounded-md">
          </a>
          <div class="max-w-[720px] flex flex-col justify-start items-start gap-2">
            <div class="mb-2">
              <a :href="item.picTextLink">{{ item.date }} / {{ item.vol }}</a>
            </div>
            <div>
              <a :href="item.picTextLink">{{ item.text }}</a>
            </div>
            <div>
              <a :href="item.articleLink" class="cursor-pointer">《{{ item.articleTitle }}》<template v-if="item.articleAuthor"> - {{ item.articleAuthor }}</template></a>
            </div>
            <div>
              <a :href="item.questionLink" class="cursor-pointer">{{ item.questionTitle }}</a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
