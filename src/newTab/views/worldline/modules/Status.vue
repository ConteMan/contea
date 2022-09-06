<script setup lang="ts">
import dayjs from 'dayjs'
import { useTimeoutFn } from '@vueuse/core'
import { Alarm } from '@services/browser'
import AlarmService from '@services/base/alarm'
import SettingItem from '@newTab/components/template/SettingItem.vue'

const alarms = ref({} as any)
const loading = ref(false)

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
  const res = await Alarm.clear(name)
  // eslint-disable-next-line no-console
  console.log(res)
  await getAlarms()
}
</script>

<template>
  <div class="px-4 max-w-[640px]">
    <div class="rounded-md p-4 w-full">
      <div class="pb-4 flex items-center">
        <span class="">定时任务 / Alarms</span>
        <mdi-refresh class="ml-4 opacity-40 cursor-pointer hover:(opacity-100)" :class="{ 'animate-spin': loading }" @click="getAlarms(true)" />
      </div>
      <SettingItem v-for="item in alarms" :key="item.name" class="py-1 mb-2">
        <template #left>
          <div class="ml-4 uppercase">
            {{ item.name }}
          </div>
        </template>
        <template #right>
          <span>{{ dayjs(item.scheduledTime).format('YYYY-MM-DD HH:mm:ss SSS') }}</span>
          <div v-if="item.periodInMinutes" class="border-l-1 mx-2 w-[1px] h-[80%]" />
          <span v-if="item.periodInMinutes">{{ item.periodInMinutes }} min</span>
          <span class="border-l-1 mx-2 w-[1px] h-[80%]" />
          <mdi-access-point class="cursor-pointer hover:(text-red-400)" @click="AlarmService.dealAlarm(item.name)" />
          <mdi-delete class="cursor-pointer hover:(text-red-400)" @click="deleteAlarm(item.name)" />
        </template>
      </SettingItem>
    </div>
  </div>
</template>
