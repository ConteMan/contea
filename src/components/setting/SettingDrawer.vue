<template>
  <n-drawer
    v-model:show="settingDrawer"
    class="pt-4 px-4"
    placement="right"
    width="500px"
    :auto-focus="false"
  >
    <Setting />
  </n-drawer>
</template>
<script setup lang="ts">
import Setting from './Setting.vue'
import { useNewTabState } from '~/store/newTab'

const newTabState = useNewTabState()
const { settingDrawer } = storeToRefs(newTabState)

</script>
