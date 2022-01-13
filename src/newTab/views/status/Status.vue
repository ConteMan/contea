<template>
  <div>
    <div class="rounded-md bg-[#f7f7f7] p-4 w-full">
      <div class="py-1 mb-2 font-semibold">
        定时任务 / Alarms
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
import SettingItem from '~/components/template/SettingItem.vue'
import { Alarm } from '~/services/browser'

const alarms = ref({} as any)
const getAlarms = async() => {
  alarms.value = await Alarm.all()
}
getAlarms()
</script>
