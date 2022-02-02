<template>
  <div v-if="recent.length">
    <div v-for="item in recent" :key="item.id" class="pb-4">
      <div>{{ item.title }}</div>
      <div class="pt-1">
        <a class="hover:( text-red-400 )" :href="item.url">{{ item.url }}</a>
      </div>
      <div class="pt-1">
        <span class=" text-gray-300">{{ item.index }}</span>
        <span class="pl-2 text-gray-300">{{ dayjs(item.dateAdded).format('YYYY-MM-DD hh:mm:ss') }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { Bookmark } from '~/services/browser'

const recent = ref([] as any[])

const getRecent = async() => {
  recent.value = await Bookmark.recent(20)
}

getRecent()
</script>
