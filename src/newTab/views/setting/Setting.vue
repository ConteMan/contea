<template>
  <div class="w-full">
    <a-collapse v-model:activeKey="activeKey" :bordered="false" class="max-w-full">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" header="基础" :style="customStyle">
        <BaseModule />
      </a-collapse-panel>

      <a-collapse-panel key="2" header="V2EX" :style="customStyle">
        <V2exModule />
      </a-collapse-panel>

      <a-collapse-panel key="3" header="测试" :style="customStyle">
        <TestModule />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts" setup>
import BaseModule from './modules/Base.vue'
import V2exModule from './modules/V2ex.vue'
import TestModule from './modules/Test.vue'

const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'

const activeKey = ref(['1', '2', '3'])
</script>
