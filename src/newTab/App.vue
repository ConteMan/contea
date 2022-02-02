<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-notification-provider>
      <AppContent />
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'
import AppContent from './views/AppContent.vue'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#DDDDDE',
    primaryColorHover: '#DDDDDE',
  },
}
</script>
