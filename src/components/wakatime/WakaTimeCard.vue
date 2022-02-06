<template>
  <Card class="flex flex-col justify-between cursor-default">
    <!-- 加载 -->
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>

    <!-- 加载成功 -->
    <div v-else>
      <div class="flex flex-row justify-between">
        <!-- 数据展示 -->
        <div v-if="login" class="space-y-1">
          <div class="flex items-center leading-none">
            <mdi-code-braces-box />
            <span class="px-1" :title="`${pastWeek.data[0].range.date} - ${pastWeek.data[6].range.date}`">七日</span>
            <span class="ml-2">{{ pastWeek.cummulative_total.text }}</span>
          </div>
          <div class="flex items-center leading-none">
            <mdi-code-braces-box />
            <span class="px-1" :title="pastWeek.data[6].range.date">昨日</span>
            <span class="ml-2">{{ pastWeek.data[6].grand_total.text }}</span>
          </div>
          <div class="flex items-center leading-none">
            <mdi-code-braces-box />
            <span class="px-1" :title="today.data[0].range.date">今日</span>
            <span class="ml-2">{{ today.cummulative_total.text }}</span>
          </div>
        </div>
        <div v-else>
          请登录
        </div>

        <!-- 操作 -->
        <div
          class="flex flex-col justify-between opacity-0 hover:(opacity-100 transition-opacity duration-200)"
          :class="{ 'opacity-100': !login, '!opacity-100': showExtend }"
        >
          <div class="flex flex-row-reverse w-full">
            <mdi-information-outline v-if="login" class="text-white cursor-pointer" @click="showExtend = !showExtend" />
            <mdi-refresh v-if="login" class="text-white cursor-pointer mr-2" :class="{'animate-spin': data.refreshLoading}" @click="getInfo(true)" />
          </div>
          <div
            class="leading-none cursor-pointer font-bold text-xl text-white select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
            @click.stop="openSite(config.site)"
          >
            {{ config.name }}
          </div>
        </div>
      </div>

      <!-- 扩展信息 -->
      <div v-if="showExtend" class="pt-4 space-y-1 text-size-[12px] text-gray-400 italic text-right">
        <div>DateType / Updated / Expried</div>
        <div>Today / {{ dayjs(today.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(today.ca_expried).format('DD HH:mm:ss') }}</div>
        <div>PastWeek / {{ dayjs(pastWeek.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(pastWeek.ca_expried).format('DD HH:mm:ss') }}</div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts" name="WakaTimeCard">
import dayjs from 'dayjs'
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
  refreshLoading: false,
  login: false,
  showExtend: false,
  config: {} as Config,
  today: {} as Info,
  pastWeek: {} as Info,
})

const getInfo = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  const today = dayjs().format('YYYY-MM-DD')
  data.config = await ConfigState.getItem(module)
  data.login = await WakaTime.loginCheck()
  if (data.login) {
    data.today = await WakaTime.daySummary(today, today, refresh)
    data.pastWeek = await WakaTime.daySummary(dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD'), refresh)
  }

  if (refresh)
    data.refreshLoading = false
  else
    data.loading--
}
getInfo()

const { loading, login, showExtend, config, today, pastWeek } = toRefs(data)
</script>
