<template>
  <Card v-if="!loading" class="flex flex-col justify-between cursor-default">
    <div class="flex flex-row justify-between">
      <div class="space-y-1">
        <div class="flex items-center leading-none">
          <mdi-code-braces-box />
          <span class="px-1" :title="`${pastWeek.data[0].range.date} - ${pastWeek.data[6].range.date}`">七日</span>
          <span class="ml-2">{{ pastWeek.cummulative_total.text }}</span>
        </div>
        <div class="flex items-center leading-none">
          <mdi-code-braces-box />
          <span class="px-1" :title="pastWeek.data[5].range.date">昨日</span>
          <span class="ml-2">{{ pastWeek.data[5].grand_total.text }}</span>
        </div>
        <div class="flex items-center leading-none">
          <mdi-code-braces-box />
          <span class="px-1" :title="today.data[0].range.date">今日</span>
          <span class="ml-2">{{ today.cummulative_total.text }}</span>
        </div>
      </div>
      <div class="flex flex-col justify-end">
        <div
          class="cursor-pointer font-bold text-xl text-white hover:(underline underline-offset-2 animate-pulse)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts" name="WakaTimeCard">
import Card from '~/components/template/TemplateCard.vue'
import { openSite } from '~/utils'
import ConfigState from '~/models/keyValue/configState'
import type { Config } from '~/services/wakatime/model'
import WakaTime from '~/services/wakatime'

const module = 'wakatime'

interface Info {
  cummulative_total: {
    text: string
  }
  [other: string]: any
}

const data = reactive({
  loading: 1,
  config: {} as Config,
  today: {} as Info,
  pastWeek: {} as Info,
})

const getInfo = async() => {
  data.config = await ConfigState.getItem(module)
  data.today = await WakaTime.daySummary()
  data.pastWeek = await WakaTime.daySummary(dayjs().subtract(6, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'))
  data.loading--
}
getInfo()

const { loading, config, today, pastWeek } = toRefs(data)
</script>
