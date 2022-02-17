<template>
  <div class="w-full max-h-screen inline-flex flex-row">
    <div class="w-full max-h-full">
      <n-tabs ref="moduleTabRef" v-model:value="tabSelected" class="pl-[80px] pt-2 pb-4" @update:value="tabChange">
        <n-tab name="worldline" tab="世界线" />
        <n-tab name="movie" tab="影视" />
        <n-tab name="sport" tab="体育" />
        <n-tab name="status" tab="状态" />
      </n-tabs>
      <div class="module-tab-pane-container w-full">
        <KeepAlive>
          <WorldlineList v-if="tabSelected === 'worldline'" class="worldline-list" />
        </KeepAlive>
        <KeepAlive>
          <MovieList v-if="tabSelected === 'movie'" />
        </KeepAlive>
        <SportList v-if="tabSelected === 'sport'" class="sport-list pl-4 pb-4 h-[calc(100%)] overflow-y-auto" />
        <StatusList v-if="tabSelected === 'status'" class="status-list pl-4 mt-4 overflow-y-auto" />
      </div>
    </div>
    <div>
      <CardList class="max-w-[400px] min-w-[400px] max-h-screen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'

import WorldlineList from '~/newTab/views/worldline/List.vue'
import SportList from '~/newTab/views/sport/List.vue'
import StatusList from '~/newTab/views/status/Status.vue'
import MovieList from '~/newTab/views/movie/MovieList.vue'

import { useNewTabState } from '~/store/newTab'
import { useConfigState } from '~/store/config'

const newTabState = useNewTabState()
const { tabSelected } = storeToRefs(newTabState)

const tabChange = (value: any) => {
  newTabState.changeTab(value)
}

const data = reactive({
  config: {} as any,
  moduleTabRef: null,
})

const configState = useConfigState()
const { all } = storeToRefs(configState)
data.config = all

const { moduleTabRef } = toRefs(data)
const { height } = useElementBounding(moduleTabRef)
const dealHeight = computed(() => {
  return `${height.value}px`
})
</script>

<style scoped>
.module-tab-pane-container {
  height: calc(100vh - v-bind(dealHeight));
  overflow-y: scroll;
}

</style>
