<template>
  <SettingItem>
    <template #left>
      <div class="ml-4 min-w-24">
        Token
      </div>
    </template>
    <template #right>
      <a-button type="text" class="bg-gray-200" @click="testFunction(V2EX.followActivity())">
        DOM 解析列表
      </a-button>
      <span class="border-l-1 mx-2"></span>
      <div class="flex flex-row justify-center">
        <input v-model="data.v2ex.tabName" class="h-full mr-1 ml-4 border-1px pl-2">
        <a-button type="text" class="bg-gray-200" @click="testFunction(V2EX.tabList(data.v2ex.tabName))">
          Tab 列表
        </a-button>
      </div>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        书签
      </div>
    </template>
    <template #right>
      <a-button type="text" class="bg-gray-200" @click="testFunction(Bookmark.tree())">
        全部
      </a-button>
      <span class="border-l-1 mx-2"></span>
      <a-button type="text" class="bg-gray-200" @click="testFunction(Bookmark.recent(10))">
        最近添加
      </a-button>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        WakaTime
      </div>
    </template>
    <template #right>
      <a-button type="text" class="bg-gray-200" @click="testFunction(WakaTime.daySummary())">
        每日数据
      </a-button>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        存储
      </div>
    </template>
    <template #right>
      <a-button type="text" class="bg-gray-200" @click="testFunction(Storage.managedUse())">
        存储用量
      </a-button>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        体育
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <input v-model="data.sport.kbsColumnId" class="h-full mr-1 ml-4 border-1px pl-2">
        <a-button type="text" class="bg-gray-200" @click="testFunction(KBS.matches(data.sport.kbsColumnId))">
          腾讯体育
        </a-button>
      </div>
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import SettingItem from '~/components/template/SettingItem.vue'

import V2EX from '~/services/v2ex'
import WakaTime from '~/services/wakatime'
import { Bookmark, Storage } from '~/services/browser/index'
import { KBS } from '~/services/sport'

interface DataType {
  v2ex: {
    tabName: string
  }
  sport: {
    kbsColumnId: number | string
  }
}

const data: UnwrapRef<DataType> = reactive({
  v2ex: {
    tabName: 'hot',
  },
  sport: {
    kbsColumnId: 'hot',
  },
})

const testFunction = async(functionIns: any) => {
  const res = await functionIns

  // eslint-disable-next-line no-console
  console.log(res)
}
</script>
