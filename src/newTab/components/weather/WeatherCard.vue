<script setup lang="ts">
import dayjs from 'dayjs'
import { ConfigModel } from '@models/index'
import type { Config } from '@services/weather/model'
import Weather from '@services/weather'
import type { StationType } from '~/services/weather/modules/cma'

const module = 'weather'

interface DataType {
  base: StationType | false
  config: Config | null
  error: boolean
}

const data: DataType = reactive({
  base: false,
  config: null,
  error: false,
})
const { base, config } = toRefs(data)

const getData = async () => {
  data.config = await ConfigModel.getItem(module)
  const res = await Weather.data('cma', { stationId: 59493 })
  if (!res)
    data.error = true
  else
    data.base = res.data
}
getData()

const dayShow = (date: string) => {
  const format = 'MM-DD'
  const dateFormat = dayjs(date).format(format)
  if (dateFormat === dayjs().subtract(1, 'day').format(format))
    return '昨日'
  if (dateFormat === dayjs().format(format))
    return '今日'
  if (dateFormat === dayjs().add(1, 'day').format(format))
    return '明日'
  if (dateFormat === dayjs().add(2, 'day').format(format))
    return '后日'

  return dateFormat
}
</script>

<template>
  <div class="p-4 flex flex-col justify-center cursor-default">
    <div v-if="!base || !config" class="duration-200 animate-pulse">
      <span v-if="data.error">Weather Request Error</span>
      <span v-else>...</span>
    </div>
    <div v-else class="flex flex-col justify-start">
      <div class="flex gap-6">
        <a class="cursor-pointer hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="config.site">
          {{ base.location.name }}
        </a>
        <span>
          {{ base.now.temperature }}
        </span>
        <span>
          <template v-if="base.now.windDirection !== '9999'">{{ base.now.windDirection }}</template> {{ base.now.windScale }}
        </span>
      </div>
      <div class="mt-4 flex flex-row flex-nowrap overflow-x-hidden gap-4">
        <div v-for="day in base.daily" :key="day.date" class="flex-shrink-0">
          <div> {{ dayShow(day.date) }} </div>
          <div> {{ day.low }} / {{ day.high }} </div>
          <div> {{ day.dayText }} / {{ day.nightText }} </div>
        </div>
      </div>
    </div>
  </div>
</template>
