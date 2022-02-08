<template>
  <div class="w-full max-h-screen min-h-screen overflow-y-hidden pr-4 pt-2 flex flex-row">
    <a-tabs v-model:activeKey="tabSelected" class="left-list w-full w-screen-sm flex-grow" @change="tabChange">
      <a-tab-pane key="worldline" tab="世界线">
        <KeepAlive>
          <WorldlineList class="worldline-list" />
        </KeepAlive>
      </a-tab-pane>
      <a-tab-pane key="movie" tab="影视">
        <KeepAlive>
          <MovieList class="ddrk-list" />
        </KeepAlive>
      </a-tab-pane>
      <a-tab-pane key="sport" tab="体育">
        <KeepAlive>
          <SportList class="sport-list pl-4 pb-4 h-[calc(100%)] overflow-y-auto" />
        </KeepAlive>
      </a-tab-pane>
      <a-tab-pane key="status" tab="状态">
        <StatusList class="status-list pl-4 mt-4 overflow-y-auto" />
      </a-tab-pane>
      <a-tab-pane key="setting" tab="设置">
        <SettingList class="setting-list pl-4 mt-4 pb-4 h-[calc(100%)] overflow-y-auto" />
      </a-tab-pane>
    </a-tabs>
    <div>
      <CardList class="max-w-[400px] min-w-[400px] max-h-screen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import WorldlineList from '~/newTab/views/worldline/List.vue'
import SportList from '~/newTab/views/sport/List.vue'
import StatusList from '~/newTab/views/status/Status.vue'
import SettingList from '~/newTab/views/setting/Setting.vue'
import MovieList from '~/newTab/views/movie/MovieList.vue'

import { useNewTabState } from '~/store/newTab'
import { useConfigState } from '~/store/config'

const newTabState = useNewTabState()
const tabSelected = newTabState.tabSelected || 'worldline'
const tabChange = (activeKey: any) => {
  newTabState.changeTab(activeKey)
}

const data = reactive({
  config: {} as any,
})
const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all
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
