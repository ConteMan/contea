<script setup lang="ts">
import dayjs from 'dayjs'
import configState from '@models/keyValue/configState'
import { enumToObj } from '@utils/index'
import type { Config } from '@services/v2ex/model'
import Alarm from '@services/base/alarm'
import Base from '@services/base'
import { TypeEnum } from '@enums/v2exEnum'
import { useNewTabState } from '@newTab/store/newTab'
import { useAlarmState } from '@newTab/store/alarm'

const module = 'v2ex'

const data = reactive({
  loading: false,
  config: {} as Config,
  moduleTypes: {} as any,
  selectedTags: ['tab-tech'] as string[],
  list: [] as any[],
})
const { loading, config, selectedTags, list, moduleTypes } = toRefs(data)

// 获取列表数据
const getData = async () => {
  data.list = await Base.listByModule({ currentPage: 1, num: 100 }, module, toRaw(selectedTags.value))
}

// 获取类型数据
const getTypes = () => {
  const res: any = enumToObj(TypeEnum, ['value', 'key'])
  res.map((item: any) => {
    item.value = `tab-${item.value}`
    return item
  })
  moduleTypes.value = res
}

// 初始化
const init = async () => {
  data.config = await configState.getItem(module)
  getTypes()
  await getData()
}
init()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  const { selectedTags } = data
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter(t => t !== tag)
  data.selectedTags = nextSelectedTags
  getData()
}

// 刷新
const refreshData = async (force: 1 | 2 = 1) => {
  data.loading = true
  if (force > 1)
    await Alarm.dealAlarm(module)
  await getData()
  data.loading = false
}

const newTabState = useNewTabState()
const alarmState = useAlarmState()
const { alarms } = storeToRefs(alarmState)

watch(() => alarms.value[module], async (newVal) => {
  newTabState.setLog(`[Worldline] [${module}] > watch: ${newVal}`)
  if (newVal)
    await refreshData(newVal)
}, { deep: true })
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="w-full pb-3 pl-2">
      <span class="cursor-pointer leading-none align-middle mr-4" @click="refreshData(2)">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </span>
      <template v-for="item in moduleTypes" :key="item.key">
        <n-tag
          class="mr-2 text-xs h-auto py-0.8"
          checkable
          :checked="selectedTags.indexOf(item.value) > -1"
          @update:checked="checked => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </n-tag>
      </template>
    </div>

    <n-scrollbar class="v2ex-content-container">
      <n-back-top :right="10000" :bottom="8" to=".v2ex-content-container" class="left-3 text-xl text-gray-400 shadow-none bg-transparent hover:(shadow-none text-[#fd2720])">
        <bx-bx-arrow-to-top />
      </n-back-top>
      <template v-for="item in list" :key="item.title">
        <div class="p-2 rounded-sm">
          <a :href="config.site + item.title_link">
            {{ item.title }}
          </a>
          <span class="text-xs text-gray-300 ml-2">
            {{ dayjs(item.ca_sort_at).format('MM-DD HH:mm') }}
          </span>
        </div>
      </template>
    </n-scrollbar>
  </div>
</template>
