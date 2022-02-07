<template>
  <n-config-provider :theme-overrides="themeOverrides" :namespace="namespace">
    <n-notification-provider>
      <AppContent />
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'
import AppContent from './views/AppContent.vue'

const data = reactive({
  namespace: 'contea-namespace',
})
const { namespace } = toRefs(data)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#DDDDDE',
    primaryColorHover: '#DDDDDE',
  },
}
</script>
