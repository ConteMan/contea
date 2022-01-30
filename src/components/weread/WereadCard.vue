<template>
  <Card v-if="!loading" class="flex flex-col justify-between">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div>Unlimit {{ dayjs(memberCard.expiredTime * 1000).format('MM-DD') }}</div>
        <div class="pt-2">
          Week {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex flex-row-reverse w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
          <mdi-information-outline class="text-white cursor-pointer" @click="showExtend = !showExtend" />
          <mdi-refresh class="text-white cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" />
        </div>
        <div
          class="cursor-pointer font-bold text-xl text-white select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
    <div class="pt-4">
      <div class="py-2 flex flex-row flex-wrap justify-between w-full">
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
import WeRead from '~/services/weread'

const module = 'weread'

dayjs.extend(Duration)

const data = reactive({
  loading: true,
  config: {} as Config,
  memberCard: {} as any,
  readDetail: {} as any,
  showExtend: false,
  refreshLoading: false,
})

const getData = async() => {
  data.config = await ConfigState.getItem(module)
  const { memberCard, readDetail } = await WeRead.user()
  data.readDetail = readDetail
  data.memberCard = memberCard
  data.loading = false
}
getData()

const { loading, config, memberCard, readDetail, showExtend, refreshLoading } = toRefs(data)
</script>
