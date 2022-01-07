<template>
  <div class="w-full max-h-screen overflow-y-hidden p-4 flex flex-row">
    <div class="w-full flex-grow w-screen-sm">
      <div class="pb-4 space-x-2">
        <span class="cursor-pointer hover:(text-red-500)" @click="tabChange('worldline')">
          Worldline
        </span>
        <span class="cursor-pointer hover:(text-red-500)" @click="tabChange('film')">
          Film
        </span>
        <span class="cursor-pointer hover:(text-red-500)" @click="tabChange('bookmark')">
          BookMark
        </span>
        <span class="cursor-pointer hover:(text-red-500)" @click="tabChange('setting')">
          Setting
        </span>
      </div>
      <KeepAlive>
        <TimeLineCard v-if="tabSelected === 'worldline'" class="timeline-card max-h-[calc(100%)] pb-8" />
      </KeepAlive>
      <KeepAlive>
        <DdrkCard v-if="tabSelected === 'film'" class="ddrk-card max-h-[calc(100%)] overflow-y-scroll pb-8" />
      </KeepAlive>
      <BookMarkList v-if="tabSelected === 'bookmark'" class="ddrk-card max-h-[calc(100%)] overflow-y-scroll pb-8" />
      <SettingList v-if="tabSelected === 'setting'" class="ddrk-card max-h-[calc(100%)] overflow-y-scroll pb-8" />
    </div>
    <div class="flex-grow flex flex-col space-y-4 p-4">
      <WakaTimeCard class="wakatime-card p-4 h-max rounded-md shadow-md"></WakaTimeCard>
      <V2EXCard class="h-max"></V2EXCard>
      <SspaiCard class="h-max"></SspaiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeLineCard from '~/newTab/views/timeLine/Card.vue'
import WakaTimeCard from '~/newTab/views/wakaTime/Card.vue'
import BookMarkList from '~/newTab/views/bookmark/List.vue'
import SettingList from '~/newTab/views/setting/Setting.vue'
import V2EXCard from '~/components/v2ex/Card.vue'
import SspaiCard from '~/components/sspai/Card.vue'
import DdrkCard from '~/components/vedio/DdrkCard.vue'

const tabSelected = ref('worldline')

const tabChange = (tab: string) => {
  tabSelected.value = tab
}

</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background-color: white;
}
::-webkit-scrollbar-thumb {
  background-color: rgb(230, 230, 230);
}
.ddrk-card::-webkit-scrollbar,
.timeline-card::-webkit-scrollbar {
  display: none;
}
.ddrk-card:hover::-webkit-scrollbar,
.timeline-card:hover::-webkit-scrollbar {
  display: none;
}
</style>
