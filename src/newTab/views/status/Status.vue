<template>
  <div>
    <div class="rounded-md bg-[#f7f7f7] p-4 w-full">
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
          <span v-if="item.periodInMinutes" class="border-l-1 mx-2"></span>
          <span v-if="item.periodInMinutes" class="mr-2">{{ item.periodInMinutes }} min</span>
        </template>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useTimeoutFn } from '@vueuse/core'
import SettingItem from '~/components/template/SettingItem.vue'
import { Alarm } from '~/services/browser'

const alarms = ref({} as any)
const loading = ref(false)

const getAlarms = async(refresh = false) => {
  if (refresh)
    loading.value = true

  useTimeoutFn(async() => {
    alarms.value = await Alarm.all()
    if (refresh)
      loading.value = false
  }, 2000)
}
getAlarms()
</script>
