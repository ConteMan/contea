<template>
  <n-config-provider
    class="config-container"
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
  </n-config-provider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, dateZhCN, zhCN } from 'naive-ui'
import AppContent from '~/newTab/layout/AppContent.vue'

const data = reactive({
  namespace: 'contea-namespace',
})
const { namespace } = toRefs(data)

useHead({
  title: 'Contea',
  meta: [
    { name: 'description', content: 'Contea' },
  ],
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
