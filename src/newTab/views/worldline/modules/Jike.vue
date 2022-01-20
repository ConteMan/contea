<template>
  <div class="jike-scroll-container">
    <a-back-top :target="getTarget" :visibility-height="500">
      <span class="text-size-2xl opacity-70 hover:(opacity-100)">
        <ic-outline-keyboard-arrow-up />
      </span>
    </a-back-top>
    <div class="tags absolute w-full bg-white pb-2 pl-2">
      <a class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': data.loading>0}" />
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
    <div class="mt-8 mb-4 space-y-4">
      <template v-for="item in list" :key="item.id">
        <div class="p-2 rounded-sm shadow-md hover:(bg-gray-200)">
          <template v-if="item.type === 'PERSONAL_UPDATE'">
            <div class="space-x-1">
              <span v-for="userItem in item.users" :key="userItem.username">
                {{ userItem.screenName }}
              </span>
            </div>

            <div>
              <template v-if="item.action === 'USER_FOLLOW'">
                <span class="mr-2">关注了</span>
                <span v-for="targetUserItem in item.allTargetUsers" :key="targetUserItem.username">
                  {{ targetUserItem.screenName }}
                </span>
              </template>
            </div>
          </template>

          <OriginalPost v-if="item.type === 'ORIGINAL_POST'" :data="item"></OriginalPost>

          <template v-if="item.type === 'REPOST'">
            <div class="pb-2">
              <span>
                {{ item.user.screenName }}
              </span>
            </div>
            <div v-if="item.content" class="pb-2">
              {{ item.content }}
            </div>
            <div class="ml-2 p-2 border-l border-l-light-600">
              <OriginalPost :data="item.target"></OriginalPost>
            </div>
          </template>

          <div v-if="item.topic" class="text-xs py-1 pt-2 text-gray-300">
            <span class="bg-gray-100 text-gray-400 py-1 px-2 rounded-sm">{{ item.topic.content }}</span>
          </div>
          <div class="text-xs pt-2 text-gray-300">
            <template v-if="item.type === 'PERSONAL_UPDATE'">
              {{ dayjs(item.actionTime).fromNow() }}
            </template>
            <template v-else>
              {{ dayjs(item.createdAt).fromNow() }}
            </template>
          </div>
        </div>
      </template>
      <a-button type="text" @click="getPage()">
        LoadMore
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { TypeEnum } from '~/enums/jikeEnum'
import { enumToObj } from '~/utils'
import Base from '~/services/jike'
import OriginalPost from '~/components/jike/components/OriginalPost.vue'

dayjs.locale('zh-cn')
dayjs.extend(RelativeTime)

const defaultTag = 'selfFeed'

const data = reactive({
  loading: 0,
  moduleTypes: {} as any,
  selectedTag: defaultTag,
  list: [] as any[],
  pageInfo: {} as any,
  loadMore: false,
})
const { list } = toRefs(data)

// 列表数据
const getPage = async() => {
  if (data.selectedTag === defaultTag) {
    const res = await Base.selfFeed(data.pageInfo?.loadMoreKey ?? undefined)
    data.list = [...data.list, ...res.viewer.followingUpdates.nodes]
    data.pageInfo = res.viewer.followingUpdates.pageInfo
    data.loadMore = res.viewer.followingUpdates.pageInfo.hasNextPage
  }
}
getPage()

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(TypeEnum, ['value', 'key'])
}
getTypes()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  data.selectedTag = checked ? tag : defaultTag
  data.pageInfo = {}
  data.list = []
  data.loadMore = false
  getPage()
}

// 刷新数据
const refresh = async() => {
  data.loading++
  await getPage()
  data.loading--
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
