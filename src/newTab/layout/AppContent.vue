<template>
  <div class="app-content-container max-h-screen min-h-screen flex flex-col">
    <div class="top-bar px-2 pt-2 bg-light-200">
      <div class="float-right">
        <a class="opacity-10 hover:(opacity-100)" @click="changeSettingDrawer()">
          <mdi-cog />
        </a>
      </div>
    </div>
    <router-view class="router-container overflow-y-auto flex-grow" />
  </div>
  <SearchModal />
  <SettingDrawer />
</template>
<script setup lang="ts">
import { useActiveElement, useEventListener } from '@vueuse/core'
import SearchModal from '~/components/search/Search.vue'
import SettingDrawer from '~/components/setting/SettingDrawer.vue'

import { useModalState } from '~/store/modal'
import { useNewTabState } from '~/store/newTab'

const defaultPath = '/zen'
const modulePath = '/module'
const searchKey = 'q'
const zenKey = 'z'
const settingKey = 's'

const router = useRouter()
const route = useRoute()

const data = reactive({
  topBarHeight: 50, // 顶部栏高度
})
const { topBarHeight } = toRefs(data)

const changeMode = () => {
  const path = route.path === defaultPath ? modulePath : defaultPath
  router.push({ path })
}

// 监听快捷键
browser.runtime.onMessage.addListener((message: any, sender: any) => {
  // eslint-disable-next-line no-console
  console.log('[AppContent receive]>', message, sender)
  if (message.data === 'change-mode')
    changeMode()
})

const modalState = useModalState()

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

// 显示/隐藏设置抽屉
const changeSettingDrawer = () => {
  const newTabState = useNewTabState()
  newTabState.changeSettingDrawer()
}

useEventListener(window, 'keyup', (e: any) => {
  // 搜索
  if (e.key === searchKey && notUsingInput.value)
    modalState.change(true)

  // 模块、禅模式切换
  if (e.key === zenKey && notUsingInput.value) // 非输入模式
    changeMode()

  if (e.key === settingKey && notUsingInput.value)
    changeSettingDrawer()
})
</script>

<style lang="less" scoped>
.top-bar {
  height: v-bind(topBarHeight)px;
}
.router-container {
  height: calc(100% - v-bind(topBarHeight)px);
}
</style>
