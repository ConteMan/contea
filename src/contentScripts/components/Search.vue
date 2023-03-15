<script setup lang="ts">
import dayjs from 'dayjs'
import type { Ref } from 'vue'
import { debouncedWatch, useMouse } from '@vueuse/core'
import { openSite as baseOpenSite, sendToBackground } from '@utils/index'
import { MESSAGE_TYPES } from '@enums/index'

const props = defineProps(['show'])
const emit = defineEmits(['update:show'])

const historyStart = 30 // 历史记录搜索开始，距离目前的天数
const BOOKMARK_RECENT = 20 // 最近书签数量
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
]
const defaultSearchIndex = 0

const data = reactive({
  searchContent: '',
  result: [] as any,
  index: 0, // 选中结果索引
  divs: {} as any, // 搜索结果引用
  mode: 1, // 1 鼠标，2 键盘
  searchMode: 1, // 1 历史记录， 2 书签, 3 搜索引擎
})
const { searchContent, result, divs } = toRefs(data)

// Modal 状态
const modalShow = ref(false)
modalShow.value = props.show

// 输入框始终获取焦点
const searchInputRef: Ref<null | HTMLElement> = ref(null)

// 跳转下个标签页
const toNextTab = () => {
  try {
    sendToBackground({
      type: MESSAGE_TYPES.NEXT_TAB,
    })
  }
  catch (e) {
    return false
  }
}

// 打开网址
const openSite = async (url: string, newTab = false) => {
  if (newTab) {
    baseOpenSite(url, '_blank')
    modalShow.value = false
    toNextTab()
  }
  else {
    baseOpenSite(url, '_self')
  }
}

// 清空搜索内容
const clearSearch = () => {
  data.searchContent = ''
}

// 搜索历史记录
const searchHistory = async () => {
  data.searchMode = 1
  const res = await sendToBackground({
    type: MESSAGE_TYPES.SEARCH_HISTORY,
    data: {
      text: searchContent.value,
      startTime: dayjs().subtract(historyStart, 'day').valueOf(),
    },
  })
  if (res)
    data.result = res
  data.index = 0
}

// 搜索书签
const searchBookmark = async (content = '') => {
  data.searchMode = 2
  if (!content) { // 没有搜索内容，加载最近书签
    data.result = await sendToBackground({
      type: MESSAGE_TYPES.RECENT_BOOKMARKS,
      data: {
        count: BOOKMARK_RECENT,
      },
    })
  }
  else {
    data.result = await sendToBackground({
      type: MESSAGE_TYPES.SEARCH_BOOKMARKS,
      data: {
        query: content,
      },
    })
  }
  data.index = 0
}

// 搜索引擎搜索
const searchWeb = async () => {
  data.searchMode = 3
  data.result = webSearch
}

// 带防抖的搜索请求处理
debouncedWatch(searchContent, async (newValue) => {
  if (/^b\s(.)*/.test(newValue))
    await searchBookmark(newValue.replace('b ', ''))
  else if (/^s\s(.)*/.test(newValue))
    await searchWeb()
  else
    await searchHistory()
}, { debounce: 300 })

// 结果容器引用
const resultRef: any = ref(null)

// 向上按键操作
const upAction = () => {
  if (!modalShow.value)
    return false

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
  if (!modalShow.value)
    return false

  data.mode = 2
  if (data.index < (data.result.length - 1))
    data.index++

  if (!data.divs[data.index] || !resultRef.value)
    return

  // 当前元素顶部距父元素顶部距离 + 元素高度 > 父元素滚动距离 + 父元素可视高度
  if (data.divs[data.index].offsetTop - resultRef.value.offsetTop + data.divs[data.index].clientHeight > resultRef.value.scrollTop + resultRef.value.clientHeight) {
    data.divs[data.index].scrollIntoView({
      behavior: 'smooth', // 平滑过渡
      block: 'end', // 下边框与视窗顶部平齐
    })
  }
}

// 保持焦点
const stayFocus = () => {
  searchInputRef.value?.focus()
}

// 处理按键事件
const dealKeyEvent = () => {
  window.addEventListener('keydown', async (e: any) => {
    if (!modalShow.value)
      return false

    e.stopPropagation()
    e.stopImmediatePropagation()

    const { activeElement } = document
    if (!activeElement || activeElement.id !== 'contea-content-script') { // shadow dom root
      const el = document.getElementById('contea-content-script')?.shadowRoot?.getElementById('contea-script-modal')
      el?.focus()
    }

    let deal = false
    if (e.key === 'Escape') {
      modalShow.value = false
      deal = true
    }
    else if (['Tab', 'ArrowDown'].includes(e.key)) {
      if (e.shiftKey && e.key === 'Tab')
        upAction()
      else
        downAction()
      deal = true
    }
    else if (['ArrowUp'].includes(e.key)) {
      upAction()
      deal = true
    }
    else if (e.key === 'Enter') {
      // 历史记录模式
      // 如果没有结果，是网址则打开新标签页，不是网址则默认搜索
      if ([1].includes(data.searchMode)) {
        if (data.result?.[data.index]) {
          openSite(data.result[data.index].url, e.metaKey)
        }
        else {
          if (/^\w+[^\s]+(\.[^\s]+){1,}$/.test(data.searchContent)) {
            const realUrl = /^(http(s)?:\/\/)(.){1,}/.test(data.searchContent) ? data.searchContent : `https://${data.searchContent}`
            openSite(realUrl, e.metaKey)
          }
          else {
            openSite(`${webSearch[defaultSearchIndex].url}${data.searchContent}`, e.metaKey)
          }
        }
      }
      // 书签模式
      if ([2].includes(data.searchMode)) {
        if (data.result?.[data.index])
          openSite(data.result[data.index].url, e.metaKey)
      }
      // 搜索引擎模式
      if ([3].includes(data.searchMode))
        openSite(`${data.result[data.index].url}${(data.searchContent).replace('s ', '')}`, e.metaKey)

      deal = true
    }

    if (deal) {
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  }, {
    // once: true,
    capture: true,
    passive: true,
  })
}

dealKeyEvent()

watch(() => props.show, async (newValue) => {
  modalShow.value = newValue
  if (newValue) {
    await nextTick()
    searchInputRef.value?.focus()
    dealKeyEvent()
  }
})
watch(modalShow, (newValue) => {
  emit('update:show', newValue)
  if (newValue) {
    clearSearch()
    searchHistory()
  }
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

const metaKey = useKeyModifier('Meta')
// 鼠标点击打开地址
const clickOpenSite = (url: string) => {
  openSite(url, !!metaKey.value)
}
</script>

<template>
  <div
    v-show="modalShow"
    id="contea-script-modal"
    class="z-2147483647 fixed w-screen h-screen top-0 left-0 bg-white bg-opacity-40 text-black text-[14px] flex justify-center items-center dark:(text-white) "
    tabindex="999"
    @click="stayFocus()"
    @focus="stayFocus()"
  >
    <div class="w-[40%] h-[80%] max-h-[400px] rounded-[6px] shadow-md bg-white flex flex-col dark:(bg-dark-800)">
      <input
        id="contea-search-input"
        ref="searchInputRef"
        v-model="searchContent"
        class="h-[60px] flex-shrink-0 flex-grow-0 border-none outline-none px-[16px] rounded-tl-[6px] rounded-tr-[6px] text-[16px]"
      >
      <div class="bg-light-400 h-[1px] flex-shrink-0 flex-grow-0 dark:(bg-gray-600)" />
      <div
        ref="resultRef"
        class="overflow-y-auto hover-scroll flex-shrink flex-grow rounded-bl-[6px] rounded-br-[6px] bg-white dark:(bg-dark-800)"
      >
        <!-- 书签、历史记录搜索模式  -->
        <template v-if="[1, 2].includes(data.searchMode)">
          <div
            v-for="(hItem, hIndex) in result"
            :key="hItem.lastVisitTime ?? hItem?.dateAdded"
            :ref="el => { if (el) divs[hIndex] = el }"
            class="py-[12px] px-[16px] cursor-pointer"
            :class="{ 'bg-hover': active(hIndex) }"
            @click="clickOpenSite(hItem.url)"
            @mouseover="setIndex(hIndex)"
          >
            <div class="truncate" :title="hItem.title">
              {{ hItem.title }}
            </div>
            <div class="mt-[6px] text-[12px] opacity-60 italic truncate" :title="hItem.url">
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
            class="py-[12px] px-[16px] cursor-pointer"
            :class="{ 'bg-hover': active(index) }"
            @click="clickOpenSite(`${item.url}${data.searchContent}`)"
            @mouseover="setIndex(index)"
          >
            <div class="truncate" :title="item.name">
              {{ item.name }}
            </div>
            <div class="mt-[6px] text-[12px] opacity-60 italic truncate" :title="item.url">
              {{ item.url }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg-hover {
  background-color: #EDECE9;
}
.dark .bg-hover {
  background-color: #6b6b6bb5;
}
</style>
