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
      <div>本周阅读 {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(readDetail.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins</div>
      <div>
        <div v-for="book in readDetail.datas[0].readMeta.books" :key="book.bookId">
          《<span class="cursor-pointer hover:(text-white)" @click="openSite(`https://weread.qq.com/web/reader/${puzzling(book.bookId)}`)">{{ book.title }}</span>》- {{ book.author }}
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
import type { Config } from '~/services/weread/model'
import { openSite } from '~/utils'
import { puzzling } from '~/utils/extend'
import Card from '~/components/template/Card.vue'
import WeRead from '~/services/weread'
import ConfigState from '~/models/keyValue/configState'

const data = reactive({
  loading: true,
  userVid: '',
  config: {} as Config,
  memberCard: {} as any,
  readDetail: {} as any,
})
const getData = async() => {
  const userVid = await WeRead.getUserId()
  if (userVid) {
    data.userVid = userVid
    data.config = await ConfigState.getItem('weread')
    const { memberCard, readDetail } = await WeRead.moduleInfo()
    data.readDetail = readDetail
    data.memberCard = memberCard
    data.loading = false
  }
}
getData()

dayjs.extend(Duration)

const { loading, config, memberCard, readDetail } = toRefs(data)
</script>

<style>
li::marker {
  margin-right: 0 !important;
}
</style>
