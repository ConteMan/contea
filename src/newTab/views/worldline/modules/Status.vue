<script setup lang="ts">
import dayjs from 'dayjs'
import { useTimeoutFn } from '@vueuse/core'
import { Alarm } from '@services/browser'
import AlarmService from '@services/base/alarm'
import SettingItem from '@newTab/components/template/SettingItem.vue'
import { MESSAGE_TYPES } from '@enums/index'
import { sendToBackground } from '@utils/index'

const alarms = ref({} as any)
const loading = ref(false)
const activeLoading = ref('')

const getAlarms = async (refresh = false) => {
  if (refresh)
    loading.value = true

  if (refresh) {
    useTimeoutFn(async () => {
      alarms.value = await Alarm.all()
      loading.value = false
    }, 2000)
  }
  else {
    alarms.value = await Alarm.all()
    loading.value = false
  }
}
getAlarms()

const deleteAlarm = async (name: string) => {
  await Alarm.clear(name)
  await getAlarms()
}

const activeAlarm = async (name: string) => {
  activeLoading.value = name
  await AlarmService.dealAlarm(name, 'page')
  activeLoading.value = ''
}

const sendBackgroundActiveAlarm = async (name: string) => {
  activeLoading.value = `${name}_background`
  await sendToBackground({
    type: MESSAGE_TYPES.DEAL_ALARM,
    name,
  })
  activeLoading.value = ''
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-shrink-0 flex-grow-0 pt-10 pb-4 px-2 flex flex-col items-start gap-2">
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="getAlarms(true)">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </div>

    <div class="hover-scroll flex-grow overflow-y-auto mt-10 mb-4 px-6 flex flex-col gap-4">
      <SettingItem
        v-for="item in alarms" :key="item.name"
        class="max-w-[800px] p-4 rounded-md bg-gray-400 bg-opacity-20 hover:(bg-opacity-40)"
      >
        <template #left>
          <div class="ml-4 uppercase">
            {{ item.name }}
          </div>
        </template>
        <template #right>
          <span>{{ dayjs(item.scheduledTime).format('YYYY-MM-DD HH:mm:ss SSS') }}</span>
          <span v-if="item.periodInMinutes" class="border-l-1 mx-2 w-[1px] h-[80%]" />
          <span v-if="item.periodInMinutes">{{ item.periodInMinutes }} min</span>
          <span class="border-l-1 mx-2 w-[1px] h-[80%]" />
          <mdi-access-point class="cursor-pointer mr-1 hover:(text-red-400)" :class="{ 'animate-spin': activeLoading === item.name }" @click="activeAlarm(item.name)" />
          <mdi-access-point-network class="cursor-pointer mr-1 hover:(text-red-400)" :class="{ 'animate-spin': activeLoading === `${item.name}_background` }" @click="sendBackgroundActiveAlarm(item.name)" />
          <mdi-delete class="cursor-pointer hover:(text-red-400)" @click="deleteAlarm(item.name)" />
        </template>
      </SettingItem>
    </div>
  </div>
</template>
