<template>
  <div class="w-full max-h-screen min-h-screen overflow-y-hidden pr-4 pt-2 flex flex-row">
    <a-tabs v-model:activeKey="tabSelected" class="left-list w-full w-screen-sm flex-grow">
      <a-tab-pane key="worldline" tab="世界线">
        <KeepAlive>
          <WorldlineList class="worldline-list" />
        </KeepAlive>
      </a-tab-pane>
      <a-tab-pane key="movie" tab="影视">
        <KeepAlive>
          <DdrkList class="ddrk-list h-[calc(100%)] overflow-y-auto" />
        </KeepAlive>
      </a-tab-pane>
      <a-tab-pane key="bookmark" tab="书签">
        <BookMarkList class="bookmark-list h-[calc(100%)] overflow-y-auto" />
      </a-tab-pane>
      <a-tab-pane key="sport" tab="体育">
        <KeepAlive>
          <SportList class="sport-list h-[calc(100%)] overflow-y-auto" />
        </KeepAlive>
      </a-tab-pane>
      <a-tab-pane key="status" tab="状态">
        <StatusList class="status-list h-[calc(100%)] overflow-y-auto" />
      </a-tab-pane>
      <a-tab-pane key="setting" tab="设置">
        <SettingList class="setting-list h-[calc(100%)] overflow-y-auto" />
      </a-tab-pane>
    </a-tabs>
    <div class="flex-grow flex flex-col space-y-4 p-4">
      <WakaTimeCard class="wakatime-card p-4 h-max rounded-md shadow-md"></WakaTimeCard>
      <V2EXCard class="h-max"></V2EXCard>
      <SspaiCard class="h-max"></SspaiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorldlineList from '~/newTab/views/worldline/List.vue'
import DdrkList from '~/components/vedio/DdrkCard.vue'
import BookMarkList from '~/newTab/views/bookmark/List.vue'
import SportList from '~/newTab/views/sport/List.vue'
import StatusList from '~/newTab/views/status/Status.vue'
import SettingList from '~/newTab/views/setting/Setting.vue'

import WakaTimeCard from '~/newTab/views/wakaTime/Card.vue'
import V2EXCard from '~/components/v2ex/Card.vue'
import SspaiCard from '~/components/sspai/Card.vue'

const tabSelected = ref('worldline')
</script>

<style scoped>
:is(.worldline-list, .ddrk-list, .bookmark-list, .sport-list, .setting-list)::-webkit-scrollbar {
  display: none;
}
:is(.worldline-list:hover, .ddrk-list:hover, .bookmark-list:hover, .sport-list:hover, .setting-list:hover)::-webkit-scrollbar {
  display: none;
}

.left-list :deep() .ant-tabs-nav {
  padding-left: 6rem;
  margin-bottom: 0;
}
.left-list :deep() .ant-tabs-content {
  position: relative;
  height: 100%;
}
.left-list :deep() .ant-tabs-tabpane {
  height: 100%;
}
</style>
