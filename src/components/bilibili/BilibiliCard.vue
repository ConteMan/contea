<template>
  <Card class="text-light-400 cursor-default flex flex-col justify-between bg-cover bg-center" :style="cardStyle">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <template v-else>
      <div class="flex flex-row justify-between items-end min-h-[48px]">
        <div v-if="!Object.keys(moduleInfo).length || error" class="text-red-600 font-medium duration-200 animate-pulse">
          Error
        </div>
        <template v-else>
          <div class="flex flex-row justify-center items-end space-x-2">
            <div class="pr-1">
              <div title="Repos">
                <span class="text-xs">关注</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.spaceSite}/${moduleInfo.mid}/fans/follow`)">
                {{ moduleInfo.following }}
              </div>
            </div>
            <div class="pr-1">
              <div title="Gists">
                <span class="text-xs">粉丝</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.spaceSite}/${moduleInfo.mid}/fans/fans`)">
                {{ moduleInfo.follower }}
              </div>
            </div>
            <div class="pr-1">
              <div title="Gists">
                <span class="text-xs">动态</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.spaceSite}/${moduleInfo.mid}/dynamic`)">
                {{ moduleInfo.dynamic_count }}
              </div>
            </div>
          </div>
        </template>
        <div class="flex flex-col justify-between">
          <div class="flex flex-row-reverse w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
            <mdi-information-outline class="cursor-pointer" @click="showExtend = !showExtend" />
            <mdi-refresh class="cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" @click="getData(true)" />
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
        <div v-if="showExtend" class="pt-4 flex flex-col text-xs">
          <div class="max-w-2/3 flex flex-wrap items-center">
            <div class="flex items-center pb-1 w-1/2">
              <mdi-account-circle-outline class="mr-2" />
              <span>{{ moduleInfo.mid }} </span>
            </div>
            <div class="flex items-center pb-1">
              <icon-park-outline-level class="mr-2 font-medium" />
              <span>lv {{ moduleInfo.level_info.current_level }} ({{ moduleInfo.level_info.current_exp }} / {{ moduleInfo.level_info.current_min }})</span>
            </div>
            <div class="flex items-center pb-1 w-1/2">
              <ri-vip-line class="mr-2" />
              <span>{{ dayjs(moduleInfo.vip.due_date).format('YYYY-MM-DD') }} </span>
            </div>
            <div class="flex items-center pb-1 w-1/2">
              <mdi-wallet class="mr-2" />
              <span>{{ moduleInfo.money }}</span>
            </div>
            <div class="flex items-center pb-1">
              <mdi-calendar-check class="mr-2" />
              <span v-if="moduleInfo.sign?.date && dayjs().isSame(dayjs(moduleInfo.sign.date), 'day')">
                已签到
              </span>
              <n-button
                v-else
                text
                color="red"
                :loading="signLoading"
                @click="sign()"
              >
                签到
              </n-button>
            </div>
          </div>

          <div class="space-y-1 text-size-[12px] text-light-400 italic text-right">
            <div>Updated / Expired</div>
            <div>{{ dayjs(extendInfo.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(extendInfo.ca_expired_at).format('DD HH:mm:ss') }}</div>
          </div>
        </div>
      </transition>
    </template>
  </Card>
</template>
<script setup lang="ts" name="BilibiliCard">
import dayjs from 'dayjs'
import { openSite } from '@utils/index'

import configState from '@models/keyValue/configState'
import type { Config } from '@services/bilibili/model'
import bilibili from '@services/bilibili'
import Card from '~/components/template/TemplateCard.vue'

const module = 'bilibili'

const data = reactive({
  loading: true,
  refreshLoading: false,
  signLoading: false,
  error: false,
  config: {} as Config,
  moduleInfo: {} as any,
  showExtend: false,
  extendInfo: {} as any,
  cardStyle: {} as any,
})
const { loading, refreshLoading, signLoading, error, config, moduleInfo, showExtend, extendInfo, cardStyle } = toRefs(data)

const getData = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  try {
    const { ca_updated_at, ca_expired_at, data: moduleData } = await bilibili.moduleInfo(refresh)
    data.moduleInfo = moduleData
    data.extendInfo = { ca_updated_at, ca_expired_at }
    data.cardStyle = {
      'background-image': moduleData.space.l_img ? `linear-gradient(-45deg, rgb(229, 231, 231, 0.6), rgb(116, 115, 115, 70%)), url(${moduleData.space.l_img})` : '',
    }
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

const sign = async() => {
  data.signLoading = true
  await bilibili.sign()
  await init()
  data.signLoading = false
}
</script>
