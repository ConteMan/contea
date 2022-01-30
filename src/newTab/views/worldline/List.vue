<template>
  <div id="page" class="h-full overflow-y-scroll w-full min-h-full">
    <a-tabs v-model:activeKey="activeKey" tab-position="left" size="small" class="worldline-tab h-full">
      <a-tab-pane v-if="config.v2ex.enable" key="v2ex" tab="V2EX">
        <V2ex class="h-full overflow-y-auto" />
      </a-tab-pane>
      <a-tab-pane v-if="config.sspai.enable" key="sspai" tab="少数派">
        <Sspai class="h-full overflow-y-auto" />
      </a-tab-pane>
      <a-tab-pane v-if="config.jike.enable" key="jike" tab="即刻">
        <Jike class="h-full overflow-y-auto" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import V2ex from './modules/V2ex.vue'
import Sspai from './modules/Sspai.vue'
import Jike from './modules/Jike.vue'

import { useConfigState } from '~/store/config'

const activeKey = ref('v2ex')
const data = reactive({
  config: {} as any,
})
const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all

const { config } = toRefs(data)
</script>

<style scoped>
.worldline-tab :deep() .ant-tabs-nav {
  padding-left: 1rem !important;
  padding-top: 2rem;
}
.worldline-tab :deep() .ant-tabs-content {
  position: relative;
  height: 100%;
}
.worldline-tab :deep() .ant-tabs-tabpane {
  height: 100%;
}
.worldline-tab :deep() .ant-tabs-tab {
  padding: 8px 1rem 8px 0;
  width: 100%;
  text-align: right;
  flex-flow: row-reverse nowrap;
}
.worldline-tab :deep() .ant-tabs-tab-btn {
  font-size: 12px;
  text-align: right;
}
.worldline-tab :deep() .ant-tabs-content-holder {
  padding-top: 1rem;
}
</style>
