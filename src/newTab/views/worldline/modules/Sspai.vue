<template>
  <div class="sspai-scroll-container">
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
          :checked="selectedTags.indexOf(item.value) > -1"
          @change="checked => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </a-checkable-tag>
      </template>
    </div>
    <div class="mt-8 mb-4">
      <template v-for="item in list" :key="item.title">
        <div class="p-2 rounded-sm hover:(bg-gray-200)">
          <template v-if="item.ca_module_type === 'followActivity'">
            <template v-if="item.key === 'like_article'">
              <a :href="'https://sspai.com/post/' + item.data.id">
                {{ item.data.title }}
              </a>
            </template>
          </template>
          <template v-if="['index', 'matrix'].includes(item.ca_module_type)">
            <a :href="'https://sspai.com/post/' + item.id">
              {{ item.title }}
            </a>
          </template>
          <div class="text-xs py-1 text-gray-300">
            <span v-if="item.ca_module_type === 'followActivity'">
              <a :href="'https://sspai.com/u/'+ item.author.slug + '/updates'">{{ item.author.nickname }}</a> {{ transformAction(item.key) }} / <a :href="'https://sspai.com/u/'+ item.data.author.slug + '/updates'">{{ item.data.author.nickname }}</a> /
            </span>
            <template v-if="['index', 'matrix'].includes(item.ca_module_type)">
              <span>
                <a :href="'https://sspai.com/u/'+ item.author.slug + '/updates'">{{ item.author.nickname }}</a> /
              </span>
              <span v-if="item.is_matrix">
                MATRIX /
              </span>
            </template>
            <span class="pl-1">
              {{ dayjs(item.ca_sort_at).format('MM-DD HH:mm') }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Base from '~/services/base'
import { TypeEnum } from '~/enums/sspaiEnum'
import { enumToObj } from '~/utils'
import Alarm from '~/services/base/alarm'

const module = 'sspai'

const data = reactive({
  loading: 0,
  moduleTypes: {} as any,
  selectedTags: [] as string[],
  list: [] as any[],
})
const { selectedTags, list } = toRefs(data)

// 列表数据
const getPage = async() => {
  data.list = await Base.listByModule({ currentPage: 1, num: 100 }, module, toRaw(selectedTags.value))
}
getPage()

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(TypeEnum, ['value', 'key'])
}
getTypes()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  const { selectedTags } = data
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter(t => t !== tag)
  data.selectedTags = nextSelectedTags
  getPage()
}

// 刷新数据
const refresh = async() => {
  data.loading++
  await Alarm.alarmDeal(module)
  await getPage()
  data.loading--
}

// 动作描述转换
const transformAction = (action: string) => {
  if (action === 'like_article')
    return 'LIKE'
}

</script>

<script lang="ts">
export default {
  methods: {
    getTarget() {
      return document.querySelector('.sspai-scroll-container') as HTMLElement
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
