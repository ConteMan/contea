<template>
  <div class="w-full rounded-md">
    <a-collapse v-model:activeKey="activeKey" :bordered="false" class="max-w-full">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="base" header="基础" :style="customStyle">
        <BaseModule />
      </a-collapse-panel>

      <a-collapse-panel key="v2ex" header="V2EX" :style="customStyle">
        <V2exModule />
      </a-collapse-panel>

      <a-collapse-panel key="sspai" header="少数派" :style="customStyle">
        <SspaiModule />
      </a-collapse-panel>

      <a-collapse-panel key="github" header="Github" :style="customStyle">
        <GithubModule />
      </a-collapse-panel>

      <a-collapse-panel key="bgm" header="番组计划" :style="customStyle">
        <BgmModule />
      </a-collapse-panel>

      <a-collapse-panel key="weather" header="天气" :style="customStyle">
        <WeatherModule />
      </a-collapse-panel>

      <a-collapse-panel key="test" header="测试" :style="customStyle">
        <TestModule />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts" setup>
import BaseModule from './modules/Base.vue'
import V2exModule from './modules/V2ex.vue'
import TestModule from './modules/Test.vue'
import SspaiModule from './modules/Sspai.vue'
import BgmModule from './modules/Bgm.vue'
import GithubModule from './modules/Github.vue'
import WeatherModule from './modules/Weather.vue'

const customStyle = 'background: #f7f7f7;margin-bottom: 16px;border: 0;overflow: hidden'

const activeKey = ref([])
</script>
