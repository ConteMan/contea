<template>
  <draggable
    v-if="data.cardList.length"
    tag="div"
    item-key="key"
    handle=".handle"
    :list="data.cardList"
    class="overflow-y-auto flex flex-col px-2"
  >
    <template #item="{ element }">
      <div class="not-first:(mt-2)">
        <WakaTimeCard
          v-if="element.key === 'wakatime'"
        />
        <V2exCard
          v-if="element.key === 'v2ex'"
          class="h-max"
        />
        <WeatherCard
          v-if="element.key === 'weather'"
          class="h-max"
        />
        <OneCard
          v-if="element.key === 'one'"
          class="h-max"
        />
        <SspaiCard
          v-if="element.key === 'sspai'"
          class="h-max"
        />
        <WereadCard
          v-if="element.key === 'weread'"
          class="h-max"
        />
        <GithubCard
          v-if="element.key === 'github'"
          class="h-max"
        />
        <JikeCard
          v-if="element.key === 'jike'"
          class="h-max"
        />
        <JuejinCard
          v-if="element.key === 'juejin'"
          class="h-max"
        />
        <ZhihuCard
          v-if="element.key === 'zhihu'"
          class="h-max"
        />
        <BilibiliCard
          v-if="element.key === 'bilibili'"
          class="h-max"
        />
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

import { useConfigState } from '~/store/config'

const data = reactive({
  cardList: [] as any,
})
const configState = useConfigState()
const { sortList } = storeToRefs(configState)

data.cardList = sortList

const setSortList = () => {
  configState.dealSortList(toRaw(data.cardList))
}
watch(data.cardList, setSortList)
</script>
