<template>
  <Card v-if="!loading" class="flex flex-col justify-between">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div>无限卡 {{ dayjs(memberCard.expiredTime * 1000).format('MM-DD') }}</div>
      </div>
      <div class="flex flex-col justify-center">
        <div
          class="cursor-pointer text-2xl text-white hover:(text-gray-400)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
    <div class="pt-2">
      <div class="pb-2">
        本周阅读 {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins
      </div>
      <div class="py-2 flex flex-row flex-wrap w-[400px]">
        <div v-for="book in readDetail.datas[0].readMeta.books" :key="book.bookId" class="flex items-center">
          <div class="w-[70px] h-[100px] mb-2">
            <img class="w-full h-full" :src="book.detail.cover">
          </div>
          <div class="ml-2 w-[100px] break-words">
            <div class="">
              <span class="cursor-pointer hover:(text-white)" @click="openSite(`https://weread.qq.com/web/reader/${puzzling(book.bookId)}`)">{{ book.title }}</span>
            </div>
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
})

const getData = async() => {
  data.config = await ConfigState.getItem(module)
  const { memberCard, readDetail } = await WeRead.user()
  data.readDetail = readDetail
  data.memberCard = memberCard
  data.loading = false
}
getData()

const { loading, config, memberCard, readDetail } = toRefs(data)
</script>
