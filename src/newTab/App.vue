<template>
  <n-config-provider
    class="config-container"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :namespace="namespace"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-notification-provider>
      <n-message-provider>
        <AppContent />
      </n-message-provider>
    </n-notification-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang="ts">
import { usePreferredDark } from '@vueuse/core'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { useNewTabState } from '@newTab/store/newTab'
import AppContent from '@newTab/layout/AppContent.vue'

const data = reactive({
  namespace: 'contea-namespace',
  theme: null as (null | typeof darkTheme),
})
const { namespace, theme } = toRefs(data)

useHead({
  title: 'Contea',
  meta: [
    { name: 'description', content: 'Contea' },
  ],
})

const isPreferredDark = usePreferredDark()
const newTabState = useNewTabState()

newTabState.changeIsPreferredDark(isPreferredDark.value)

watch(isPreferredDark, (isDark) => {
  newTabState.changeIsPreferredDark(isDark)
})
watch(() => newTabState.theme, (newVal) => {
  data.theme = newVal === 'dark' ? darkTheme : null
})

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ff4f49',
    primaryColorHover: '#fd2720',
  },
  Input: {
    borderHover: '#fff',
    borderFocus: '#fff',
    boxShadowFocus: '#fff',
    caretColor: '#e5e5e5',
  },
  Switch: {
    boxShadowFocus: '#fff',
  },
}
</script>
