<template>
  <Card class="flex flex-col justify-between">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <div v-else>
      <div v-if="login">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col justify-center">
            <div>无限 {{ dayjs(memberCard.expiredTime * 1000).format('MM-DD') }}</div>
            <div class="pt-1">
              本周 {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins
            </div>
          </div>
          <div class="flex flex-col justify-between opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
            <div class="flex flex-row-reverse w-full">
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
        <div class="pt-2">
          <div class="pt-2 flex flex-row flex-wrap justify-between w-full">
            <div v-for="book in readDetail.datas[0].readMeta.books" :key="book.bookId" class="flex items-center">
              <div class="h-[100px] mb-2">
                <img class="w-full h-full shadow-md rounded-sm" :src="book.detail.cover">
              </div>
              <div class="ml-2 w-[80px] break-words">
                <n-ellipsis line-clamp="2">
                  <span class="cursor-pointer hover:(text-white)" @click="openSite(`https://weread.qq.com/web/reader/${puzzling(book.bookId)}`)">{{ book.title }}</span>
                </n-ellipsis>
                <div class="text-size-[12px] text-warm-gray-100 pt-1">
                  {{ book.author }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 扩展信息 -->
        <transition name="fade">
          <div v-if="showExtend" class="pt-4 space-y-1 text-size-[12px] text-gray-400 italic text-right">
            <div>Updated / Expried</div>
            <div>{{ dayjs(extendInfo.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(extendInfo.ca_expried).format('DD HH:mm:ss') }}</div>
          </div>
        </transition>
      </div>
      <div v-else class="flex flex-row justify-between items-center">
        <div>请登录</div>
        <div
          class="cursor-pointer font-bold text-xl text-white hover:(underline underline-offset-2 duration-200 animate-pulse)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup lang="ts" name="WereadCard">
import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'

import { openSite } from '~/utils'
import { puzzling } from '~/utils/extend'

import Card from '~/components/template/TemplateCard.vue'
import ConfigState from '~/models/keyValue/configState'

import type { Config } from '~/services/weread/model'
import weread from '~/services/weread'

dayjs.extend(Duration)

const module = 'weread'

const data = reactive({
  loading: true,
  config: {} as Config,
  login: false,
  memberCard: {} as any,
  readDetail: {} as any,
  showExtend: false,
  refreshLoading: false,
  extendInfo: {} as any,
})

const { loading, config, login, memberCard, readDetail, showExtend, refreshLoading, extendInfo } = toRefs(data)

const init = async() => {
  data.config = await ConfigState.getItem(module)
}
init()

const getData = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  data.login = await weread.loginCheck()
  if (data.login) {
    const { memberCard, readDetail, ca_updated_at, ca_expried } = await weread.user(refresh)
    data.readDetail = readDetail
    data.memberCard = memberCard
    data.extendInfo = { ca_updated_at, ca_expried }
  }

  if (refresh)
    data.refreshLoading = false
  else
    data.loading = false
}
getData()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
