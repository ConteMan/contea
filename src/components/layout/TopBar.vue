<template>
  <div class="top-bar px-2 pt-2 opacity-0 hover:(opacity-100)">
    <div class="flex justify-end gap-2 text-gray-400">
      <a class="opacity-10 hover:(opacity-100)" @click="changeTheme()">
        <ic-sharp-light-mode v-if="newTabState.theme === 'light'" />
        <ic-sharp-dark-mode v-else />
      </a>
      <a class="opacity-10 hover:(opacity-100)" @click="toZenPage()">
        <mdi-wallpaper />
      </a>
      <a class="opacity-10 hover:(opacity-100)" @click="changeSettingDrawer()">
        <mdi-cog />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewTabState } from '~/store/newTab'

const newTabState = useNewTabState()

// 显示/隐藏设置抽屉
const changeSettingDrawer = () => {
  newTabState.changeSettingDrawer()
}

const changeTheme = () => {
  newTabState.changeTheme(newTabState.theme === 'dark' ? 'light' : 'dark')
}

const router = useRouter()
const toZenPage = () => {
  router.push({ path: '/zen' })
}
</script>
