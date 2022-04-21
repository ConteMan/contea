<template>
  <Card v-if="!loading" class="flex flex-col">
    <div class="flex justify-between">
      <div v-if="login">
        <div class="flex items-center">
          <mdi-fire />
          <span class="ml-2">{{ moduleShowData?.dau }}</span>
        </div>
        <div class="flex items-center">
          <mdi-gold />
          <span class="ml-2">{{ moduleShowData?.balance?.gold }} / {{ moduleShowData?.balance?.silver }} / {{ moduleShowData?.balance?.bronze }}</span>
        </div>
        <div class="flex items-center">
          <mdi-calendar-text />
          <span v-if="showDays(moduleShowData?.mission?.date)" class="ml-2">
            {{ moduleShowData?.mission?.days }} DAYS
          </span>
          <template v-else>
            <a v-if="!missionLoading" class="ml-2 font-medium cursor-pointer" @click="mission()">
              [ Sign ]
            </a>
            <span v-else class="ml-2 font-medium cursor-default">
              Ing ...
            </span>
          </template>
        </div>
      </div>
      <div v-else class="flex flex-row justify-start items-end">
        Login
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex-grow flex flex-row-reverse items-center w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
          <mdi-information-outline class="cursor-pointer" @click="showExtend = !showExtend" />
          <mdi-refresh class="cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" @click="refreshData()" />
        </div>
        <div
          class="cursor-pointer font-bold text-xl select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
    <!-- 扩展信息 -->
    <transition name="fade">
      <div v-if="showExtend" class="pt-4 space-y-1 text-size-[12px] text-gray-400 italic text-right">
        <div>Updated / Expired</div>
        <div>{{ dayjs(moduleData.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(moduleData.ca_expired_at).format('DD HH:mm:ss') }}</div>
      </div>
    </transition>
  </Card>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { openSite } from '@utils/index'
import configState from '@models/keyValue/configState'
import type { Config, cacheUser } from '@services/v2ex/model'
import v2ex from '@services/v2ex'
import Card from '~/components/template/TemplateCard.vue'
import { useNewTabState } from '~/store/newTab'
import { useAlarmState } from '~/store/alarm'

const module = 'v2ex'

const data = reactive({
  loading: true,
  refreshLoading: false,
  missionLoading: false,
  config: {} as Config,
  login: false,
  moduleData: {} as cacheUser,
  showExtend: false,
})
const { loading, refreshLoading, missionLoading, config, login, moduleData, showExtend } = toRefs(data)
const moduleShowData = computed(() => {
  return data.moduleData.data
})

const getData = async() => {
  const moduleTypeData = await v2ex.moduleTypeData()
  data.login = await v2ex.loginCheck()
  data.moduleData = moduleTypeData[module]
  data.loading = false
}

const refreshData = async(force: 1|2 = 1) => {
  data.refreshLoading = true
  if (force > 1) await v2ex.updateModuleTypeData()
  await getData()
  data.refreshLoading = false
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

const newTabState = useNewTabState()
const alarmState = useAlarmState()
const { alarms } = storeToRefs(alarmState)

watch(() => alarms.value[module], async(newVal) => {
  newTabState.setLog(`[Card] [${module}] > watch: ${newVal}`)
  if (newVal) {
    await refreshData(newVal)
    alarmState.removeAlarm(module)
  }
}, { deep: true })
</script>
