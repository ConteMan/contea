<template>
  <n-modal
    v-model:show="show"
    transform-origin="center"
    :auto-focus="true"
  >
    <div class="w-1/2">
      <n-input
        ref="searchInputRef"
        v-model:value="searchContent"
        placeholder="Search"
        size="large"
        class="search-input"
      >
        <template #prefix>
          <transition
            mode="out-in"
            enter-active-class="animate__animated animate__faster animate__flipInX"
            leave-active-class="animate__animated animate__faster animate__flipOutX"
          >
            <mdi-history v-if="data.searchMode === 1" class="mr-1" />
            <mdi-book-outline v-else-if="data.searchMode === 2" class="mr-1" />
            <icon-park-outline-search v-else class="mr-1" />
          </transition>
        </template>
      </n-input>
      <div
        ref="resultRef"
        :style="{ height: `${resultContainerHeight}px` }"
        class="mt-2 rounded-sm bg-white overflow-y-auto"
      >
        <!-- 书签、历史记录搜索模式  -->
        <template v-if="[1, 2].includes(data.searchMode)">
          <div
            v-for="(hItem, hIndex) in result"
            :key="hItem.lastVisitTime ?? hItem?.dateAdded"
            :ref="el => { if (el) divs[hIndex] = el }"
            class="py-2 px-4 cursor-pointer"
            :class="{ 'bg-gray-200': active(hIndex) }"
            @click="openSite(hItem.url)"
            @mouseover="setIndex(hIndex)"
          >
            <div class="truncate" :title="hItem.title">
              {{ hItem.title }}
            </div>
            <div class="text-gray-400 text-xs italic truncate" :title="hItem.url">
              <span v-if="hItem?.lastVisitTime">{{ dayjs(hItem.lastVisitTime).format('MM-DD HH:mm') }}</span>
              <span v-if="hItem?.dateAdded">{{ dayjs(hItem.dateAdded).format('YYYY-MM-DD HH:mm') }}</span>
              / {{ hItem.url }}
            </div>
          </div>
        </template>

        <!-- 搜索引擎搜索模式  -->
        <template v-if="[3].includes(data.searchMode)">
          <div
            v-for="(item, index) in result"
            :key="item.name"
            :ref="el => { if (el) divs[index] = el }"
            class="py-2 px-4 cursor-pointer"
            :class="{ 'bg-gray-200': active(index) }"
            @click="openSite(`${item.url}${data.searchContent}`)"
            @mouseover="setIndex(index)"
          >
            <div class="truncate" :title="item.name">
              {{ item.name }}
            </div>
            <div class="text-gray-400 text-xs italic truncate" :title="item.url">
              {{ item.url }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { debouncedWatch, onStartTyping, useMouse, onKeyStroke } from '@vueuse/core'
import { useModalState } from '~/store/modal'
import { openSite } from '~/utils'

const resultContainerHeight = 400 // 结果框的高度
const historyStart = 30 // 历史记录搜索开始，距离目前的天数
const bookmarkRecent = 20 // 最近书签数量
const webSearch = [ // 搜索引擎列表
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
  },
  {
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
  },
  {
    name: 'Duckduckgo',
    url: 'https://duckduckgo.com/?q=',
  },
  {
    name: 'Sogou',
    url: 'https://www.sogou.com/web?query=',
  },
  {
    name: 'Douban',
    url: 'https://www.douban.com/search?q=',
  },
  {
    name: 'Cupfox',
    url: 'https://www.cupfox.com/search?key=',
  },
]
const defaultSearchIndex = 0

const data = reactive({
  searchContent: '',
  result: [] as any,
  historyResult: [] as any,
  bookmarkResult: [] as any,
  index: 0, // 选中结果索引
  divs: {} as any, // 搜索结果引用
  mode: 1, // 1 鼠标，2 键盘
  searchMode: 1, // 1 历史记录， 2 书签, 3 搜索引擎
})
const { searchContent, result, divs } = toRefs(data)

// 状态管理搜索状态
const modalState = useModalState()
const { show } = storeToRefs(modalState)

// 清空搜索内容
const clearSearch = () => {
  data.searchContent = ''
}

// 搜索历史记录
const searchHistory = async() => {
  data.searchMode = 1
  data.result = await browser.history.search({
    text: searchContent.value,
    startTime: dayjs().subtract(historyStart, 'day').valueOf(),
  })
  data.index = 0
}

// 搜索书签
const searchBookmark = async(content = '') => {
  data.searchMode = 2
  if (!content) { // 没有搜索内容，加载最近书签
    data.result = await browser.bookmarks.getRecent(bookmarkRecent)
  }
  else {
    data.result = await browser.bookmarks.search({
      query: content,
    })
  }
  data.index = 0
}

// 搜索引擎搜索
const searchWeb = async() => {
  data.searchMode = 3
  data.result = webSearch
}

// 初始化
watch(show, (newValue) => {
  if (newValue) {
    clearSearch()
    searchHistory()
  }
})

// 带防抖的搜索请求处理
debouncedWatch(searchContent, (newValue) => {
  if (/^b\s(.)*/.test(newValue))
    searchBookmark(newValue.replace('b ', ''))
  else if (/^s\s(.)*/.test(newValue))
    searchWeb()
  else
    searchHistory()
}, { debounce: 300 })

// 输入框始终获取焦点
const searchInputRef: any = ref(null)
onStartTyping(() => {
  if (show.value && !searchInputRef.value.active)
    searchInputRef.value.focus()
})

// 结果容器引用
const resultRef: any = ref(null)

// 向上按键操作
const upAction = () => {
  data.mode = 2
  if (data.index > 0)
    data.index--

  if (!data.divs[data.index] || !resultRef.value)
    return

  // 当前元素顶部距父元素顶部距离 < 父元素滚动距离
  if (data.divs[data.index].offsetTop - resultRef.value.offsetTop < resultRef.value.scrollTop) {
    data.divs[data.index].scrollIntoView({
      behavior: 'smooth', // 平滑过渡
      block: 'start', // 上边框与视窗顶部平齐。默认值
    })
  }
}

// 向下按键操作
const downAction = () => {
  data.mode = 2
  if (data.index < (data.result.length - 1))
    data.index++

  if (!data.divs[data.index] || !resultRef.value)
    return

  // 当前元素顶部距父元素顶部距离 + 元素高度 > 父元素滚动距离 + 父元素可视高度
  if (data.divs[data.index].offsetTop - resultRef.value.offsetTop + data.divs[data.index].clientHeight > resultRef.value.scrollTop + resultContainerHeight) {
    data.divs[data.index].scrollIntoView({
      behavior: 'smooth', // 平滑过渡
      block: 'end', // 下边框与视窗顶部平齐
    })
  }
}

onKeyStroke('ArrowUp', (e) => {
  upAction()
  e.preventDefault()
})

onKeyStroke('ArrowDown', (e) => {
  downAction()
  e.preventDefault()
})

onKeyStroke('Enter', (e) => {
  // 历史记录模式
  // 如果没有结果，是网址则打开新标签页，不是网址则默认搜索
  if ([1].includes(data.searchMode)) {
    if (data.result?.[data.index]) {
      openSite(data.result[data.index].url)
    }
    else {
      if (/^\w+[^\s]+(\.[^\s]+){1,}$/.test(data.searchContent)) {
        const realUrl = /^(http(s)?:\/\/)(.){1,}/.test(data.searchContent) ? data.searchContent : `https://${data.searchContent}`
        browser.tabs.create({ active: true, url: realUrl })
      }
      else {
        openSite(`${webSearch[defaultSearchIndex].url}${data.searchContent}`)
      }
    }
  }
  // 书签模式
  if ([2].includes(data.searchMode)) {
    if (data.result?.[data.index])
      openSite(data.result[data.index].url)
  }
  // 搜索引擎模式
  if ([3].includes(data.searchMode))
    openSite(`${data.result[data.index].url}${(data.searchContent).replace('s ', '')}`)
})

onKeyStroke('Tab', (e) => {
  if (e.shiftKey && e.key === 'Tab' && e.type === 'keydown')
    upAction()
  else
    downAction()
  e.preventDefault()
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
.search-input {
  border: none !important;
}
</style>
