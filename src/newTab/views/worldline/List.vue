<template>
  <div id="page" class="h-full overflow-y-scroll w-full min-h-full">
    <a-tabs v-model:activeKey="activeKey" tab-position="left" size="small" class="worldline-tab h-full">
      <!-- <a-tab-pane key="now">
        <template #tab>
          <div class="flex items-center leading-none">
            <span class="ml-1">此刻</span>
          </div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="all" tab="时间轴">
        时间轴
      </a-tab-pane> -->
      <a-tab-pane key="v2ex" tab="V2EX">
        <V2ex class="h-full overflow-y-auto" />
      </a-tab-pane>
      <a-tab-pane key="sspai" tab="少数派">
        <Sspai class="h-full overflow-y-auto" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import V2ex from './modules/V2ex.vue'
import Sspai from './modules/Sspai.vue'

const activeKey = ref('v2ex')
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
