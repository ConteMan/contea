<template>
  <Card class="flex flex-col justify-between">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <template v-else>
      <div class="flex flex-row justify-between items-end">
        <!-- 异常 -->
        <div v-if="!moduleInfo?.name || error" class="text-red-600 font-medium duration-200 animate-pulse">
          Error
        </div>

        <template v-else>
          <div class="flex flex-row justify-center items-center space-x-2">
            <div class="pr-1">
              <div>
                <span class="text-xs">回答</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/people/${moduleInfo.name}/answers`)">
                {{ moduleInfo.answer_count }}
              </div>
            </div>
            <div class="pr-1">
              <div>
                <span class="text-xs">想法</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/people/${moduleInfo.name}/pins`)">
                {{ moduleInfo.pins_count }}
              </div>
            </div>
            <div class="pr-1">
              <div>
                <span class="text-xs">收藏</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/people/${moduleInfo.name}/collections`)">
                {{ moduleInfo.favorite_count }}
              </div>
            </div>
          </div>
        </template>
        <div class="flex flex-col justify-between">
          <div class="flex flex-row-reverse w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
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
        <div v-if="showExtend" class="pt-4 flex flex-col">
          <div class="space-y-1 text-size-[12px] text-gray-400 italic text-right">
            <div>Updated / Expired</div>
            <div>{{ dayjs(extendInfo.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(extendInfo.ca_expired_at).format('DD HH:mm:ss') }}</div>
          </div>
        </div>
      </transition>
    </template>
  </Card>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { openSite } from '@utils/index'

import configState from '@models/keyValue/configState'

import type { Config } from '@services/zhihu/model'
import Zhihu from '@services/zhihu'
import Card from '~/components/template/TemplateCard.vue'

const module = 'zhihu'

const data = reactive({
  loading: true,
  refreshLoading: false,
  error: false,
  config: {} as Config,
  moduleInfo: {} as any,
  showExtend: false,
  extendInfo: {} as any,
})
const { loading, refreshLoading, error, config, moduleInfo, showExtend, extendInfo } = toRefs(data)

const getData = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  try {
    const { ca_updated_at, ca_expired_at, data: userData } = await Zhihu.moduleInfo(refresh)
    data.moduleInfo = userData
    data.extendInfo = { ca_updated_at, ca_expired_at }
  }
  catch (e) {
    data.error = true
  }

  if (refresh)
    data.refreshLoading = false
  else
    data.loading = false
}
getData()

const init = async() => {
  data.config = await configState.getItem(module)
  getData()
}
init()
</script>
