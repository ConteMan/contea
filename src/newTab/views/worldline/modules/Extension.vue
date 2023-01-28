<script setup lang="ts">
import type { Management } from 'webextension-polyfill'
import BaseService from '@services/extension'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'

interface Data {
  loading: boolean
  list: Management.ExtensionInfo[]
}

const data: Data = reactive({
  loading: true,
  list: [],
})
const { loading, list } = toRefs(data)

// 获取展示数据
const getData = async () => {
  const res = await BaseService.all()
  if (res)
    data.list = res
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
  await getData()
  data.loading = false
}
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </template>

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4">
        <template v-for="item in list" :key="item.vol">
          <div class="p-4 rounded-md bg-gray-400 bg-opacity-20 hover:(bg-opacity-40)">
            <div class="flex items-center gap-8">
              <a :href="`https://chrome.google.com/webstore/detail/${item.id}`">
                <img v-if="item?.icons?.length" :src="item.icons[0].url" class="h-[16px] rounded-md">
              </a>
              <div class="flex-grow pt-2 flex flex-col justify-start items-start gap-2">
                <div>{{ item.name }} / {{ item.id }} / {{ item.version }} / {{ item.type }} / {{ item.installType }} / {{ item.enabled ? 'enabled' : 'disabled' }}({{ item.mayDisable }})</div>
                <div>{{ item.description }}</div>
                <div v-if="item?.optionsUrl">
                  {{ item.optionsUrl }}
                </div>
                <div v-if="item?.homepageUrl">
                  {{ item.homepageUrl }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </WorldlineContent>
</template>
