<template>
  <div id="page" class="h-full overflow-y-scroll w-full min-h-full">
    <a-tabs v-model:activeKey="activeKey" tab-position="left" size="small" class="list-tab h-full">
      <a-tab-pane key="libvio" tab="Libvio">
        <Libvio class="h-full overflow-y-auto" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import Libvio from './modules/Libvio.vue'

import { useConfigState } from '~/store/config'

const activeKey = ref('libvio')
const data = reactive({
  config: {} as any,
})
const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all
</script>

<style scoped>
.list-tab :deep() .ant-tabs-nav {
  padding-left: 1rem !important;
  padding-top: 2rem;
}
.list-tab :deep() .ant-tabs-content {
  position: relative;
  height: 100%;
}
.list-tab :deep() .ant-tabs-tabpane {
  height: 100%;
  padding-left: 1.5rem !important;
}
.list-tab :deep() .ant-tabs-tab {
  padding: 8px 1rem 8px 0;
  width: 100%;
  text-align: right;
  flex-flow: row-reverse nowrap;
}
.list-tab :deep() .ant-tabs-tab-btn {
  font-size: 12px;
  text-align: right;
}
.list-tab :deep() .ant-tabs-content-holder {
  padding-top: 1rem;
}
</style>
