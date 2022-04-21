<template>
  <Card v-if="!loading" class="flex flex-col justify-between cursor-default">
    <div>
      <!-- 已登录 -->
      <div v-if="login">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col justify-center">
            <div>{{ dayjs(memberCard?.data.expiredTime * 1000).format('MM-DD') }}</div>
            <div class="pt-1">
              {{ dayjs.duration(readDetail?.data.datas[0].timeMeta.totalReadTime, 's').hours() }} hrs {{ dayjs.duration(readDetail?.data.datas[0].timeMeta.totalReadTime, 's').minutes() }} mins
            </div>
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex flex-row-reverse w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
              <mdi-information-outline class="cursor-pointer" @click="showExtend = !showExtend" />
              <mdi-refresh class="cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" @click="refreshData(2)" />
            </div>
            <div
              class="cursor-pointer font-bold text-xl select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
              @click.stop="openSite(config.site)"
            >
              {{ config.name }}
            </div>
          </div>
        </div>
        <!-- 书籍展示 -->
        <div v-if="bookList.length" class="pt-2">
          <div class="pt-2 flex flex-row flex-wrap justify-between w-full">
            <div v-for="book in bookList" :key="book?.bookId" class="flex items-center">
              <div class="book-img-container h-[100px] mb-2">
                <img class="book-img w-full h-full rounded-sm duration-300" :src="book?.cover">
              </div>
              <div class="ml-2 w-[80px] break-words">
                <n-ellipsis line-clamp="2">
                  <span class="cursor-pointer hover:(underline underline-offset-2 duration-200 animate-pulse)" @click="openSite(`https://weread.qq.com/web/reader/${puzzling(book.bookId)}`)">{{ book.title }}</span>
                </n-ellipsis>
                <div class="text-size-[12px] text-gray-400 pt-1 cursor-default">
                  {{ book.author }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 扩展信息 -->
        <transition name="fade">
          <div v-if="showExtend" class="flex flex-col items-end pt-4 space-y-1 text-size-[12px] text-gray-400 italic text-right">
            <div class="pb-1 border-b border-gray-400">
              Type / Updated / Expired
            </div>
            <div> ModuleData / {{ dayjs(moduleData?.ca_updated_at).format('DD HH:mm:ss') }} / {{ moduleData?.ca_expired_at ? dayjs(moduleData?.ca_expired_at).format('DD HH:mm:ss') : '-' }}</div>
            <div> MemberCard / {{ dayjs(memberCard?.ca_updated_at).format('DD HH:mm:ss') }} / {{ memberCard?.ca_expired_at ? dayjs(memberCard?.ca_expired_at).format('DD HH:mm:ss') : '-' }}</div>
            <div> ReadDetail / {{ dayjs(readDetail?.ca_updated_at).format('DD HH:mm:ss') }} / {{ readDetail?.ca_expired_at ? dayjs(readDetail?.ca_expired_at).format('DD HH:mm:ss') : '-' }}</div>
          </div>
        </transition>
      </div>
      <!-- 未登录 -->
      <div v-else class="flex flex-row justify-between items-center">
        <div>Login</div>
        <div
          class="cursor-pointer font-bold text-xl hover:(underline underline-offset-2 duration-200 animate-pulse)"
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

import { openSite } from '@utils/index'
import configState from '@models/keyValue/configState'
import { isEmpty } from '@utils/is'
import { puzzling } from '@utils/extend'

import type { Config } from '@services/weread/model'
import { ModuleType } from '@services/weread/model'
import weread from '@services/weread'
import { useAlarmState } from '@store/alarm'
import Card from '~/components/template/TemplateCard.vue'

dayjs.extend(Duration)

const module = 'weread'

const data = reactive({
  loading: true,
  refreshLoading: false,
  config: {} as Config,
  login: true,
  moduleData: {} as any,
  memberCard: {} as any,
  readDetail: {} as any,
  bookList: [] as any,
  showExtend: false,
  extendInfo: {} as any,
  alarms: {} as any,
})

const { loading, config, login, moduleData, memberCard, readDetail, bookList, showExtend, refreshLoading } = toRefs(data)

const getConfig = async() => {
  data.config = await configState.getItem(module)
}

const loginCheck = async() => {
  const login = await weread.loginCheck()
  data.login = login
  return login
}

const getData = async() => {
  const moduleTypeData = await weread.moduleTypeData()
  data.moduleData = moduleTypeData[module]
  data.readDetail = moduleTypeData[`${module}_${ModuleType.READ_DETAIL}`]
  data.memberCard = moduleTypeData[`${module}_${ModuleType.MEMBER_CARD}`]
  if (isEmpty(data.moduleData) || isEmpty(data.readDetail) || isEmpty(data.memberCard)) {
    data.login = false
    data.loading = false
    return
  }

  // eslint-disable-next-line no-console
  console.log(`[weread][getData] > MEMBER_CARD > ${moduleTypeData[`${module}_${ModuleType.MEMBER_CARD}`].ca_updated_at}`)

  data.bookList = readDetail.value.data.datas[0].readMeta.books ? (readDetail.value.data.datas[0].readMeta.books).slice(0, 2) : []
  data.loading = false
}

const refreshData = async(update: 1 | 2 = 1) => {
  data.refreshLoading = true
  if (update > 1)
    await weread.updateModuleTypeData()
  await getData()
  data.refreshLoading = false
}

const init = async() => {
  await getConfig()

  await loginCheck()
  if (!loginCheck()) {
    data.loading = false
    return false
  }

  await getData()
}

const alarmState = useAlarmState()
const { alarms } = storeToRefs(alarmState)
data.alarms = alarms

watch(() => data.alarms, async(newVal) => {
  // eslint-disable-next-line no-console
  console.log('[weread component] > alarms', newVal)
  if (newVal[module]) {
    await refreshData(newVal[module])
    alarmState.removeAlarm(module)
  }
}, { deep: true })

init()
</script>

<style lang="less">
.book-img-container {
  &:hover {
    box-shadow: 2px 3px 2px rgba(156, 154, 154, 0.4);
    img {
      transform: translateX(2px);
    }
  }
}
</style>
