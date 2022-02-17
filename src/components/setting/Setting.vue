<template>
  <div class="w-full max-w-[700px] rounded-md">
    <n-collapse v-model:expanded-names="expandedNames" class="max-w-full">
      <n-collapse-item name="base" title="基础">
        <BaseModule />
      </n-collapse-item>

      <n-collapse-item name="wakatime" title="WakaTime">
        <WakaTime />
      </n-collapse-item>

      <n-collapse-item name="v2ex" title="V2EX">
        <V2exModule />
      </n-collapse-item>

      <n-collapse-item name="sspai" title="少数派">
        <SspaiModule />
      </n-collapse-item>

      <n-collapse-item name="github" title="Github">
        <GithubModule />
      </n-collapse-item>

      <n-collapse-item name="bgm" title="番组计划">
        <BgmModule />
      </n-collapse-item>

      <n-collapse-item name="weather" title="天气">
        <WeatherModule />
      </n-collapse-item>

      <n-collapse-item name="zhihu" title="知乎">
        <ZhihuModule />
      </n-collapse-item>

      <n-collapse-item name="bilibili" title="Bilibili">
        <BilibiliModule />
      </n-collapse-item>

      <n-collapse-item name="test" title="测试">
        <TestModule />
      </n-collapse-item>
    </n-collapse>
  </div>
</template>
<script lang="ts" setup>
import BaseModule from '~/components/setting/modules/Base.vue'
import V2exModule from '~/components/setting/modules/V2ex.vue'
import TestModule from '~/components/setting/modules/Test.vue'
import SspaiModule from '~/components/setting/modules/Sspai.vue'
import BgmModule from '~/components/setting/modules/Bgm.vue'
import GithubModule from '~/components/setting/modules/Github.vue'
import WeatherModule from '~/components/setting/modules/Weather.vue'
import ZhihuModule from '~/components/setting/modules/Zhihu.vue'
import BilibiliModule from '~/components/setting/modules/Bilibili.vue'
import WakaTime from '~/components/setting/modules/WakaTime.vue'

const expandedNames = ref([])
</script>

<style scoped lang="less">
.n-collapse .n-collapse-item {
  margin: 0.5rem 0 0 0;
  background-color: rgba(209, 213, 219, 0.178);
  border-radius: 0.25rem;
  :deep(.n-collapse-item__header) {
    padding: 1rem;
  }
  :deep(.n-collapse-item__content-wrapper) {
    padding: 0 2rem 1rem 2rem;
  }
}
</style>
