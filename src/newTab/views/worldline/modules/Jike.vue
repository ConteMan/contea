<template>
  <div class="jike-scroll-container relative">
    <a-back-top :target="getTarget" :visibility-height="500">
      <span class="text-size-2xl opacity-70 hover:(opacity-100)">
        <ic-outline-keyboard-arrow-up />
      </span>
    </a-back-top>

    <!-- 顶部操作栏 -->
    <div class="tags sticky top-0 w-full z-10 bg-white pb-2 pl-2">
      <a class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': loading}" />
      </a>
      <template v-for="item in data.moduleTypes" :key="item.key">
        <a-checkable-tag
          :checked="data.selectedTag === item.value"
          @change="(checked: boolean) => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </a-checkable-tag>
      </template>
    </div>

    <!-- 内容列表 -->
    <div class="max-w-[800px] mb-4 space-y-4">
      <template v-for="item in dealList" :key="item.id">
        <div class="p-4 rounded-md shadow-sm hover:(shadow-md bg-[#FFE012] bg-opacity-40)">
          <!-- 个人动态更新 -->
          <template v-if="item.type === 'PERSONAL_UPDATE'">
            <div class="space-x-1 font-medium">
              <span v-for="(userItem, index) in item.users" :key="userItem.username">
                <template v-if="index">、</template>
                <a class="hover:(duration-200 animate-pulse)" :href="`${config.site}/u/${userItem.username}`">{{ userItem.screenName }}</a>
              </span>
            </div>

            <div>
              <template v-if="item.action === 'USER_FOLLOW'">
                <span class="mr-2">关注了</span>
                <span v-for="(targetUserItem, index) in item.allTargetUsers" :key="targetUserItem.username" class="mr-2">
                  <span v-if="index">，</span>
                  <a class="font-medium hover:(duration-200 animate-pulse)" :href="`${config.site}/u/${targetUserItem.username}`">{{ targetUserItem.screenName }}</a>
                </span>
              </template>
            </div>
          </template>

          <!-- 原创 -->
          <OriginalPost v-if="item.type === 'ORIGINAL_POST'" :data="item"></OriginalPost>

          <!-- 转发 -->
          <template v-if="item.type === 'REPOST'">
            <div class="pb-2">
              <div class="font-medium">
                <a class="hover:(duration-200 animate-pulse)" :href="`${config.site}/u/${item.user.username}`">{{ item.user.screenName }}</a>
              </div>
              <n-ellipsis line-clamp="1" :tooltip="false" class="mt-1 text-gray-300 text-xs">
                {{ item.user.briefIntro }}
              </n-ellipsis>
            </div>
            <div v-if="item.content" class="pb-2" v-html="contentDeal(item)">
            </div>
            <div class="ml-2 p-2 border-l border-l-light-600 relative">
              <OriginalPost :data="{...item.target, isRepost: true }" />
            </div>
          </template>

          <!-- 圈子 -->
          <div v-if="item.topic" class="text-xs py-1 pt-2 text-gray-300">
            <a class="hover:(duration-200 animate-pulse)" :href="`${config.site}/topic/${item.topic.id}`">
              <span class="bg-gray-100 text-gray-400 py-1 px-2 rounded-sm">{{ item.topic.content }}</span>
            </a>
          </div>

          <!-- 原链接、时间 -->
          <div class="text-xs pt-2 text-gray-400 flex justify-end">
            <div v-if="['ORIGINAL_POST', 'REPOST'].includes(item.type)" class="inline-block mr-2 cursor-pointer hover:(text-yellow-500)">
              <mdi-open-in-new @click="openSite(`${config.site}/${typeUrl(item.type)}/${item.id}`)" />
            </div>
            <span>
              <template v-if="item.type === 'PERSONAL_UPDATE'">
                {{ dayjs(item.actionTime).fromNow() }}
              </template>
              <template v-else>
                {{ dayjs(item.createdAt).fromNow() }}
              </template>
            </span>
          </div>
        </div>
      </template>

      <div class="flex justify-center">
        <span v-if="loading" class="duration-200 animate-pulse">
          ...
        </span>
        <a-button v-if="loadmore && !loading" type="text" @click="getPage()">
          更多
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { openSite, enumToObj } from '~/utils'

import type { Config } from '~/services/jike/model'
import { TypeEnum } from '~/enums/jikeEnum'
import Base from '~/services/jike'
import OriginalPost from '~/components/jike/components/OriginalPost.vue'
import configState from '~/models/keyValue/configState'

dayjs.locale('zh-cn')
dayjs.extend(RelativeTime)

const module = 'jike'
const defaultTag = 'selfFeed'

const data = reactive({
  loading: true,
  loadmore: false,
  config: {} as Config,
  moduleTypes: {} as any,
  selectedTag: defaultTag,
  list: [] as any[],
  pageInfo: {} as any,
})
const { loading, loadmore, config } = toRefs(data)

// 列表数据
const getPage = async() => {
  if (data.selectedTag === defaultTag) {
    const res = await Base.selfFeed(data.pageInfo?.loadMoreKey ?? undefined)
    data.list = [...data.list, ...res.viewer.followingUpdates.nodes]
    data.pageInfo = res.viewer.followingUpdates.pageInfo
    data.loadmore = res.viewer.followingUpdates.pageInfo.hasNextPage
  }
  data.loading = false
}

// 处理后的列表
const dealList = computed(() => data.list.filter((item) => {
  return item.__typename !== 'BannerMessage'
}))

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(TypeEnum, ['value', 'key'])
}

const init = async() => {
  getTypes()
  data.config = await configState.getItem(module)
  await getPage()
}
init()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  data.selectedTag = checked ? tag : defaultTag
  data.pageInfo = {}
  data.list = []
  data.loadmore = false
  getPage()
}

// 刷新数据
const refresh = async() => {
  data.loading = true
  await getPage()
}

const typeUrl = (type: string) => {
  const typeUrls: any = {
    ORIGINAL_POST: 'originalPost',
    REPOST: 'repost',
  }
  return typeUrls[type]
}

const contentDeal = (data: any) => {
  let content = data.content.replace(/\n/gi, '<br>')
  if (data?.urlsInText && data?.urlsInText.length) {
    data.urlsInText.forEach((urlItem: any) => {
      // 站内链接
      if (/^jike:\/\/(.){1,}/.test(urlItem.url)) {
        const userId = (urlItem.url).replace('jike://page.jk/user/', '')
        content = content.replace(urlItem.originalUrl, `<a class="px-1 cursor-pointer underline underline-offset-2 hover:(duration-200 animate-pulse)" href="${config.value.site}/u/${userId}">${urlItem.title}</a>`)
      }
      else {
        content = content.replace(urlItem.originalUrl, `<a class="px-1 cursor-pointer underline underline-offset-2 hover:(duration-200 animate-pulse)" href="${urlItem.originalUrl}">${urlItem.title}</a>`)
      }
    })
  }
  return content
}
</script>

<script lang="ts">
export default {
  methods: {
    getTarget() {
      return document.querySelector('.jike-scroll-container') as HTMLElement
    },
  },
}
</script>

<style>
.ant-back-top {
  left: 1rem;
  bottom: 1rem;
}
</style>
