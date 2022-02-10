<template>
  <Card class="flex flex-col">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <div v-else class="flex justify-between">
      <div v-if="login">
        <div class="flex items-center">
          <mdi-fire />
          <span class="ml-2">{{ moduleInfo?.dau }}</span>
        </div>
        <div class="flex items-center">
          <mdi-gold />
          <span class="ml-2">{{ moduleInfo?.balance?.gold }} / {{ moduleInfo?.balance?.silver }} / {{ moduleInfo?.balance?.bronze }}</span>
        </div>
        <div class="flex items-center">
          <mdi-calendar-text />
          <span v-if="showDays(moduleInfo?.mission?.date)" class="ml-2">
            {{ moduleInfo?.mission?.days }} DAYS
          </span>
          <template v-else>
            <a v-if="!missionLoading" class="ml-2 text-white font-medium cursor-pointer" @click="mission()">
              [ Sign ]
            </a>
            <span v-else class="ml-2 text-white font-medium cursor-default">
              Ing ...
            </span>
          </template>
        </div>
      </div>
      <div v-else>
        未登录
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex-grow flex flex-row-reverse items-center w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
          <mdi-information-outline class="text-white cursor-pointer" @click="showExtend = !showExtend" />
          <mdi-refresh class="text-white cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" @click="getData(true)" />
        </div>
        <div
          class="cursor-pointer font-bold text-xl text-white select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
    <!-- 扩展信息 -->
    <transition name="fade">
      <div v-if="showExtend" class="pt-4 space-y-1 text-size-[12px] text-gray-400 italic text-right">
        <div>Updated / Expried</div>
        <div>{{ dayjs(extendInfo.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(extendInfo.ca_expried_at).format('DD HH:mm:ss') }}</div>
      </div>
    </transition>
  </Card>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { openSite } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import configState from '~/models/keyValue/configState'
import type { Config } from '~/services/v2ex/model'
import v2ex from '~/services/v2ex'

const module = 'v2ex'

const data = reactive({
  loading: true,
  refreshLoading: false,
  missionLoading: false,
  config: {} as Config,
  login: false,
  moduleInfo: {} as any,
  showExtend: false,
  extendInfo: {} as any,
})
const { loading, refreshLoading, missionLoading, config, login, moduleInfo, showExtend, extendInfo } = toRefs(data)

const getData = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  const { ca_updated_at, ca_expried_at, data: moduleData, ca_login } = await v2ex.user(refresh)
  data.moduleInfo = moduleData
  data.extendInfo = { ca_updated_at, ca_expried_at }
  data.login = ca_login ?? false

  if (refresh)
    data.refreshLoading = false
  else
    data.loading = false
}

const init = async() => {
  data.config = await configState.getItem(module)
  await getData()
}
init()

const mission = async() => {
  data.missionLoading = true

  await v2ex.mission()
  await getData()

  data.missionLoading = false
}

const showDays = (date: string | undefined) => {
  if (!date)
    return false

  if (!dayjs().isAfter(dayjs().format('YYYY-MM-DD 06:00:00')))
    return true

  if (date === dayjs().format('YYYY-MM-DD'))
    return true
  return false
}
</script>
