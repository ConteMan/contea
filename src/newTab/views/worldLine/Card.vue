<template>
  <div id="page" class="h-full overflow-y-scroll w-full">
    <template v-for="item in list" :key="item.title">
      <div class="p-2 hover:(bg-gray-200)">
        <template v-if="item.ca_module === 'v2ex'">
          <a :href="'https://v2ex.com' + item.title_link">
            {{ item.title }}
          </a>
        </template>
        <template v-if="item.ca_module === 'sspai'">
          <a :href="'https://sspai.com/post/' + item.data.id">
            {{ item.data.title }}
          </a>
        </template>
        <div class="text-xs py-1">
          <span class=" text-gray-300">
            {{ dayjs(item.ca_sort_at).format('YYYY-MM-DD HH:mm') }}
          </span>
          <span class=" text-gray-300 ml-2">
            {{ item.ca_module.toUpperCase() }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Base from '~/services/base'

const list = ref([] as any[])

const getPage = async() => {
  const res = await Base.list({ currentPage: 1, num: 10 })
  list.value = res
}

getPage()
</script>
