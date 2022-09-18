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
        <div class="p-4 mb-6 rounded-md flex gap-4">
          <a :href="item.picTextLink"><img :src="item.pic" class="h-full max-h-[160px] rounded-md"></a>
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
    </n-scrollbar>
  </div>
</template>
