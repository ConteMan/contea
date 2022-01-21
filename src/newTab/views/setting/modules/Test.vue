<template>
  <SettingItem>
    <template #left>
      <div class="ml-4 min-w-24">
        V2EX
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
        模块
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <input v-model="data.module.moduleName" class="h-full mr-1 ml-4 border-1px pl-2">
        <a-button type="text" class="bg-gray-200" @click="testFunction(ConfigState.init(data.module.moduleName as any))">
          初始化设置
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

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        微信读书
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <a-button type="text" class="bg-gray-200" @click="testFunction(WeRead.user(true))">
          强制更新
        </a-button>
        <span class="border-l-1 mx-2"></span>
        <a-button type="text" class="bg-gray-200" @click="testFunction(WeRead.getUserId())">
          获取 UserId
        </a-button>
      </div>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        番组计划
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <a-button type="text" class="bg-gray-200" @click="testFunction(Bgm.me())">
          个人信息
        </a-button>
      </div>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        Github
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <a-button type="text" class="bg-gray-200" @click="testFunction(Github.user())">
          个人信息
        </a-button>
        <span class="border-l-1 mx-2"></span>
        <a-button type="text" class="bg-gray-200" @click="testFunction(Github.starredCount())">
          获取标星
        </a-button>
      </div>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        即刻
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <a-button type="text" class="bg-gray-200" @click="testFunction(Jike.me())">
          个人信息
        </a-button>
      </div>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        掘金
      </div>
    </template>
    <template #right>
      <div class="flex flex-row justify-center">
        <a-button type="text" class="bg-gray-200" @click="testFunction(Juejin.getSessionId())">
          获取 SessionId
        </a-button>
        <span class="border-l-1 mx-2"></span>
        <a-button type="text" class="bg-gray-200" @click="testFunction(Juejin.me())">
          个人信息
        </a-button>
      </div>
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import SettingItem from '~/components/template/SettingItem.vue'

import ConfigState from '~/models/keyValue/configState'
import V2EX from '~/services/v2ex'
import WakaTime from '~/services/wakatime'
import { Bookmark, Storage } from '~/services/browser/index'
import { KBS } from '~/services/sport'
import WeRead from '~/services/weread'
import Bgm from '~/services/bgm'
import Github from '~/services/github'
import Jike from '~/services/jike'
import Juejin from '~/services/juejin'

interface DataType {
  v2ex: {
    tabName: string
  }
  sport: {
    kbsColumnId: number | string
  }
  module: {
    moduleName: string
  }
}

const data: UnwrapRef<DataType> = reactive({
  v2ex: {
    tabName: 'hot',
  },
  sport: {
    kbsColumnId: 'hot',
  },
  module: {
    moduleName: 'bgm',
  },
})

const testFunction = async(functionIns: any) => {
  const res = await functionIns

  // eslint-disable-next-line no-console
  console.log(res)
}
</script>
