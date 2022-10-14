<script setup lang="ts">
import dayjs from 'dayjs'
import { ConfigModel } from '@models/index'
import type { Config } from '@services/weather/model'
import Weather from '@services/weather'

const module = 'weather'

const data = reactive({
  base: {} as any,
  config: {} as Config,
  error: false,
})
const { base, config } = toRefs(data)

const getData = async () => {
  data.config = await ConfigModel.getItem(module)
  const res = await Weather.data()
  if (!res)
    data.error = true
  else
    data.base = res.data
}
getData()

const dayShow = (date: string) => {
  const format = 'YYYY-MM-DD'
  const dateFormat = dayjs(date).format(format)
  if (dateFormat === dayjs().subtract(1, 'day').format(format))
    return '昨日'
  if (dateFormat === dayjs().format(format))
    return '今日'
  if (dateFormat === dayjs().add(1, 'day').format(format))
    return '明日'
  if (dateFormat === dayjs().add(2, 'day').format(format))
    return '后日'

  return date
}
</script>

<template>
  <div class="p-4 flex flex-col justify-center cursor-default">
    <div v-if="!Object.keys(base).length" class="duration-200 animate-pulse">
      <span v-if="data.error">Weather Request Error</span>
      <span v-else>...</span>
    </div>
    <div v-else class="flex flex-row justify-between">
      <div class="flex-col">
        <div class="flex items-center">
          <a class="ml-2 cursor-pointer hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="config.site">
            {{ base.location.name }} ({{ base.location.longitude }}, {{ base.location.latitude }})
          </a>
        </div>
        <div class="flex items-center">
          <span class="ml-2">
            {{ base.now.temperature }}
          </span>
        </div>
        <div class="flex items-center">
          <span class="ml-2">
            <template v-if="base.now.windDirection !== '9999'">{{ base.now.windDirection }}</template> {{ base.now.windScale }}
          </span>
        </div>
      </div>
      <div>
        <template v-for="(day, index) in base.daily" :key="day.date">
          <template v-if="index < 3">
            <div class="space-x-2">
              <span> {{ dayShow(day.date) }} </span>
              <span> {{ day.low }} / {{ day.high }} </span>
              <span> {{ day.dayText }} / {{ day.nightText }} </span>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
