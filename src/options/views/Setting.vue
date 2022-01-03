<template>
  <div class="w-full">
    <a-collapse v-model:activeKey="activeKey" :bordered="false" class="max-w-full">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" header="基础" :style="customStyle">
        <div class="flex border-l-2 border-l-gray-300 hover:(border-l-red-600)">
          <div class="flex-grow-0 flex flex-col justify-center">
            <div class="ml-4">
              初始化
            </div>
          </div>
          <div class="flex-grow text-right">
            <a-button type="text" class="bg-gray-200" @click="ConfigState.init()">
              确定
            </a-button>
          </div>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="2" header="V2EX" :style="customStyle">
        <div class="flex border-l-2 border-blue-gray-300 hover:(border-l-red-600)">
          <div class="flex-grow flex flex-col justify-center">
            <div class="ml-4">
              开启
            </div>
          </div>
          <div class="flex-grow-1 flex flex-row-reverse text-right w-screen-sm">
            <a-switch v-model:checked="dataObj.v2ex.enable" checked-children="开" un-checked-children="关" @change="actionSet('v2ex', 'enable', dataObj.v2ex.enable)" />
          </div>
        </div>
        <div class="flex border-l-2 border-l-gray-300 mt-2 hover:(border-l-red-600)">
          <div class="flex-grow flex flex-col justify-center">
            <div class="ml-4">
              Token
            </div>
          </div>
          <div class="flex-grow-1 flex flex-row-reverse text-right w-screen-sm">
            <a-input v-model:value="v2exToken" @blur="actionSet('v2ex', 'token', v2exToken)" />
          </div>
        </div>
        <div class="flex border-l-2 border-l-gray-300 mt-2 hover:(border-l-red-600)">
          <div class="flex-grow flex flex-col justify-center">
            <div class="ml-4">
              定时
            </div>
          </div>
          <div class="flex-grow-1 flex flex-row-reverse text-right w-screen-sm">
            <a-input v-model:value="v2exAlarm" addon-after="分钟" @blur="actionSet('v2ex', 'alarm', Number(v2exAlarm))" />
          </div>
        </div>
        <div class="flex border-l-2 border-l-gray-300 mt-2 hover:(border-l-red-600)">
          <div class="flex-grow flex flex-col justify-center">
            <div class="ml-4">
              类型
            </div>
          </div>
          <div class="flex-grow-1 flex flex-row-reverse text-right w-screen-sm">
            <a-checkbox-group v-model:value="dataObj.v2exEnableTypes" name="v2exTypeCheckbox" :options="v2exTypes" @change="actionSet('v2ex', 'enableTypes')" />
          </div>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="3" header="测试" :style="customStyle">
        <div class="flex border-l-2 border-l-gray-300 hover:(border-l-red-600)">
          <div class="flex-grow flex flex-col justify-center">
            <div class="ml-4">
              V2EX
            </div>
          </div>
          <div class="flex-grow-1 flex flex-row text-right w-screen-sm space-x-4 divide-x-2">
            <a-button type="text" class="bg-gray-200" @click="testFunction(V2EX.followActivity())">
              DOM 解析列表
            </a-button>
            <div class="flex flex-row justify-center">
              <input v-model="testTabName" class="h-full mr-1 ml-4 border-1px pl-2">
              <a-button type="text" class="bg-gray-200" @click="testFunction(V2EX.tabList(testTabName))">
                Tab 列表
              </a-button>
            </div>
          </div>
        </div>
        <div class="flex border-l-2 border-l-gray-300 mt-2 hover:(border-l-red-600)">
          <div class="flex-grow flex flex-col justify-center">
            <div class="ml-4">
              书签
            </div>
          </div>
          <div class="flex-grow-1 flex flex-row text-right w-screen-sm space-x-4 divide-x-2">
            <a-button type="text" class="bg-gray-200" @click="testFunction(Bookmark.tree())">
              全部
            </a-button>
            <a-button type="text" class="bg-gray-200" @click="testFunction(Bookmark.recent(10))">
              最近添加
            </a-button>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import ConfigState from '~/models/keyValue/configState'
import V2EX from '~/services/v2ex'
import Bookmark from '~/services/bookmark'
const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'

interface DataType {
  v2exEnableTypes: []
  v2ex: {
    enable?: boolean
  }
}

const v2exTypes = [
  {
    label: '关注',
    value: 'members',
  },
  {
    label: '最热',
    value: 'hot',
  },
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '技术',
    value: 'tech',
  },
]

const activeKey = ref(['1', '2', '3'])
const v2exToken = ref('')
const v2exAlarm = ref(0)
const dataObj: UnwrapRef<DataType> = reactive({
  v2exEnableTypes: [],
  v2ex: {
    enable: true,
  },
})

const testTabName = ref('')

const getSetting = async() => {
  const settings = await (await ConfigState.bulkGetItem(['v2ex'])).toArray()
  v2exToken.value = settings[0]?.token ?? ''
  v2exAlarm.value = settings[0]?.alarm ?? 0
  dataObj.v2exEnableTypes = settings[0].enableTypes ?? []
  dataObj.v2ex = settings[0]
}

const setSetting = async(key: string, data: object) => {
  await ConfigState.mergeSet(key, data)
}

const actionSet = async(module: string, keyName: string, data?: any) => {
  if (module === 'v2ex' && keyName === 'enableTypes') data = toRaw(dataObj).v2exEnableTypes
  await setSetting(module, { [keyName]: data })
}

const testFunction = async(functionIns: any) => {
  const res = await functionIns

  // eslint-disable-next-line no-console
  console.log(res)
}

const { v2exEnableTypes } = toRefs(dataObj)

watch(v2exEnableTypes, (newValue, oldValue) => {
  // eslint-disable-next-line no-console
  console.log('watch:', newValue, oldValue)
})

getSetting()
</script>
