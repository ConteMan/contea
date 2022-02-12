<template>
  <Card class="flex flex-col">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <div v-else class="flex justify-between">
      <div v-if="login" class="flex flex-row justify-center items-center space-x-2">
        <div class="pr-1">
          <div>
            <span class="text-xs">能量</span>
          </div>
          <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/u/${moduleInfo.slug}/overview`)">
            {{ moduleInfo.liked_count }}
          </div>
        </div>
      </div>
      <div v-else class="flex flex-row justify-center items-end text-red-500">
        请登录
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex-grow flex justify-end w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
          <mdi-refresh class="text-white cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" @click="getData(true)" />
          <mdi-information-outline class="text-white cursor-pointer" @click="showExtend = !showExtend" />
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
import type { Config } from '~/services/sspai/model'
import sspai from '~/services/sspai'

const module = 'sspai'

const data = reactive({
  loading: true,
  refreshLoading: false,
  config: {} as Config,
  login: false,
  moduleInfo: {} as any,
  showExtend: false,
  extendInfo: {} as any,
})
const { loading, refreshLoading, config, login, moduleInfo, showExtend, extendInfo } = toRefs(data)

const getData = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  data.login = await sspai.loginCheck()
  if (data.login) {
    const { ca_updated_at, ca_expried_at, data: moduleData } = await sspai.moduleInfo(refresh)
    data.moduleInfo = moduleData
    data.extendInfo = { ca_updated_at, ca_expried_at }
  }

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
</script>
