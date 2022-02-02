/* eslint-disable no-console */
<template>
  <n-modal
    v-model:show="showModal"
    transform-origin="center"
    :auto-focus="true"
  >
    <div class="w-1/2">
      <n-input
        ref="searchInputRef"
        v-model:value="searchContent"
        placeholder="搜索"
        size="large"
      >
        <template #prefix>
          <icon-park-outline-search class="mr-1" />
        </template>
      </n-input>
      <div ref="resultRef" class="mt-2 rounded-sm bg-white overflow-y-auto" :class="`h-[${resultContainerHeight}px]`">
        <div
          v-for="(hItem, hIndex) in historyResult"
          :key="hItem.lastVisitTime"
          :ref="el => { if (el) divs[hIndex] = el }"
          class="py-2 px-4 cursor-pointer"
          :class="{ 'bg-gray-200': active(hIndex) }"
          @click="openSite(hItem.url)"
          @mouseover="setIndex(hIndex)"
        >
          <div class="truncate" :title="hItem.title">
            {{ hItem.title }}
          </div>
          <div class="text-gray-400 text-xs truncate" :title="hItem.url">
            {{ hItem.url }}
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { debouncedWatch, onStartTyping, onKeyStroke, useMouse } from '@vueuse/core'
import { useModalState } from '~/store/modal'
import { openSite } from '~/utils'

const resultContainerHeight = 400

const data = reactive({
  showModal: false as any,
  searchContent: '',
  historyResult: [] as any,
  index: 0,
  divs: {} as any, // 搜索结果引用
  mode: 1, // 1 鼠标，2 键盘
})
const { showModal, searchContent, historyResult, divs } = toRefs(data)

// 状态管理搜索状态
const modalState = useModalState()
const { show } = storeToRefs(modalState)
data.showModal = show

// 清空搜索内容
const clearSearch = () => {
  data.searchContent = ''
}

// 搜索历史记录
const searchHistory = async() => {
  data.historyResult = await browser.history.search({
    text: searchContent.value,
  })
  data.index = 0
}

// 初始化
watch(show, (newValue, oldValue) => {
  if (newValue) {
    clearSearch()
    searchHistory()
  }
})

// 带防抖的搜索
debouncedWatch(searchContent, () => {
  searchHistory()
}, { debounce: 500 })

// 输入框始终获取焦点
const searchInputRef: any = ref(null)
onStartTyping(() => {
  if (show.value && !searchInputRef.value.active)
    searchInputRef.value.focus()
})

// 结果容器引用
const resultRef: any = ref(null)

// 向上按键
onKeyStroke('ArrowUp', (e) => {
  data.mode = 2
  if (data.index > 0)
    data.index--

  // 当前元素顶部距父元素顶部距离 < 父元素滚动距离
  if (data.divs[data.index].offsetTop - resultRef.value.offsetTop < resultRef.value.scrollTop) {
    data.divs[data.index].scrollIntoView({
      behavior: 'smooth', // 平滑过渡
      block: 'start', // 上边框与视窗顶部平齐。默认值
    })
  }
  e.preventDefault()
})

// 向下按键
onKeyStroke('ArrowDown', (e) => {
  data.mode = 2
  if (data.index < (data.historyResult.length - 1))
    data.index++

  // 当前元素顶部距父元素顶部距离 + 元素高度 > 父元素滚动距离 + 父元素可视高度
  if (data.divs[data.index].offsetTop - resultRef.value.offsetTop + data.divs[data.index].clientHeight > resultRef.value.scrollTop + resultContainerHeight) {
    data.divs[data.index].scrollIntoView({
      behavior: 'smooth', // 平滑过渡
      block: 'end', // 下边框与视窗顶部平齐
    })
  }

  e.preventDefault()
})

// 回车执行
onKeyStroke('Enter', (e) => {
  if (data.historyResult?.[data.index])
    openSite(data.historyResult[data.index].url)
})

// 判断激活
const active = (key: number) => {
  return key === data.index
}

// 鼠标事件设置激活
const setIndex = (index: number) => {
  if (data.mode === 1)
    data.index = index
}

// 更新模板引用
onBeforeUpdate(() => {
  divs.value = []
})

// 鼠标移动则设置鼠标模式
const { x, y } = useMouse({ touch: false })
watch(x, () => {
  data.mode = 1
})
watch(y, () => {
  data.mode = 1
})
</script>

<style lang="less">
</style>
