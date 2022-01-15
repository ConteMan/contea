<template>
  <Card v-if="Object.keys(base).length > 0" class="flex flex-col justify-center cursor-default">
    <div class="now flex flex-row justify-between">
      <div class="flex-col">
        <div class="py-1 flex items-center leading-none">
          <mdi-map-marker />
          <span class="ml-2">
            {{ base.location.longitude }}, {{ base.location.latitude }}
          </span>
        </div>
        <div class="py-1 flex items-center leading-none">
          <mdi-temperature-celsius />
          <span class="ml-2">
            {{ base.now.temperature }}
          </span>
        </div>
        <div class="py-1 flex items-center leading-none">
          <mdi-windsock />
          <span class="ml-2">
            <template v-if="base.now.windDirection !== '9999'">{{ base.now.windDirection }}</template> {{ base.now.windScale }}
          </span>
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <div class="text-2xl text-white">
          {{ base.location.name }}
        </div>
      </div>
    </div>

    <div class="daily pt-4">
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
  </Card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Card from '~/components/template/Card.vue'
import Weather from '~/services/weather'

const data = reactive({
  base: {} as any,
})
const getData = async() => {
  const res = await Weather.data()
  data.base = res
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

const { base } = toRefs(data)
</script>
