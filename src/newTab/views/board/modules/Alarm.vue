<script setup lang="ts">
import dayjs from 'dayjs'
import { useTimeoutFn } from '@vueuse/core'
import { Alarm } from '@services/browser'
import { MESSAGE_TYPES } from '@enums/index'
import { sendToBackground } from '@utils/index'
import AlarmService from '@services/base/alarm'
import SettingItem from '@newTab/components/template/SettingItem.vue'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'

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
  const res = await AlarmService.dealAlarm(name, 'page')
  // eslint-disable-next-line no-console
  console.log('activeAlarm: ', res)
  activeLoading.value = ''
}

const sendBackgroundActiveAlarm = async (name: string) => {
  activeLoading.value = `${name}_background`
  const res = await sendToBackground({
    type: MESSAGE_TYPES.DEAL_ALARM,
    name,
  })
  // eslint-disable-next-line no-console
  console.log('sendBackgroundActiveAlarm: ', res)
  activeLoading.value = ''
}
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="getAlarms(true)">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </template>

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4">
        <SettingItem
          v-for="item in alarms" :key="item.name"
          class="max-w-[1080px] p-4 rounded-md bg-gray-400 bg-opacity-20 hover:(bg-opacity-40)"
        >
          <template #left>
            <div class="ml-4 uppercase">
              {{ item.name }}
            </div>
          </template>
          <template #right>
            <span>{{ dayjs(item.scheduledTime).format('YYYY-MM-DD HH:mm:ss SSS') }}</span>
            <span v-if="item.periodInMinutes" class="h-[30%] mx-4 border-l border-l-gray-400 opacity-20" />
            <span v-if="item.periodInMinutes">{{ item.periodInMinutes }} min</span>
            <span class="h-[30%] mx-4 border-l border-l-gray-400 opacity-20" />
            <n-tooltip trigger="hover">
              <template #trigger>
                <mdi-access-point class="cursor-pointer mr-2 hover:(text-red-400) focus:(outline-none)" :class="{ 'animate-spin': activeLoading === item.name }" @click="activeAlarm(item.name)" />
              </template>
              直接执行
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <mdi-access-point-network class="cursor-pointer mr-2 hover:(text-red-400) focus:(outline-none)" :class="{ 'animate-spin': activeLoading === `${item.name}_background` }" @click="sendBackgroundActiveAlarm(item.name)" />
              </template>
              发送到后台
            </n-tooltip>
            <mdi-delete class="cursor-pointer hover:(text-red-400) focus:(outline-none)" @click="deleteAlarm(item.name)" />
          </template>
        </SettingItem>
      </div>
    </template>
  </WorldlineContent>
</template>
