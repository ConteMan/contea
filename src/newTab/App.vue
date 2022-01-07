<template>
  <div class="w-full max-h-screen overflow-y-hidden p-4 flex flex-row">
    <div class="w-full flex-grow w-screen-sm">
      <div class="pl-2 pb-4 h-auto space-x-2">
        <span class="px-2 py-1 inline-block rounded-md cursor-pointer hover:(text-red-500)" :class="{'active-tab': tabSelected === 'worldline'}" @click="tabChange('worldline')">
          世界线
        </span>
        <span class="px-2 py-1 inline-block rounded-md cursor-pointer hover:(text-red-500)" :class="{'active-tab': tabSelected === 'film'}" @click="tabChange('film')">
          Film
        </span>
        <span class="px-2 py-1 inline-block rounded-md cursor-pointer hover:(text-red-500)" :class="{'active-tab': tabSelected === 'bookmark'}" @click="tabChange('bookmark')">
          BookMark
        </span>
        <span class="px-2 py-1 inline-block rounded-md cursor-pointer hover:(text-red-500)" :class="{'active-tab': tabSelected === 'sport'}" @click="tabChange('sport')">
          Sport
        </span>
        <span class="px-2 py-1 inline-block rounded-md cursor-pointer hover:(text-red-500)" :class="{'active-tab': tabSelected === 'setting'}" @click="tabChange('setting')">
          Setting
        </span>
      </div>
      <KeepAlive>
        <WorldLineCard v-if="tabSelected === 'worldline'" class="timeline-card max-h-[calc(100%)] pb-8" />
      </KeepAlive>
      <KeepAlive>
        <DdrkCard v-if="tabSelected === 'film'" class="ddrk-card max-h-[calc(100%)] overflow-y-scroll pb-8" />
      </KeepAlive>
      <BookMarkList v-if="tabSelected === 'bookmark'" class="ddrk-card max-h-[calc(100%)] overflow-y-scroll pb-8" />
      <SettingList v-if="tabSelected === 'setting'" class="setting-list max-h-[calc(100%)] overflow-y-scroll pb-8" />
      <KeepAlive>
        <SportList v-if="tabSelected === 'sport'" class="sport-list max-h-[calc(100%)] overflow-y-scroll pb-8" />
      </KeepAlive>
    </div>
    <div class="flex-grow flex flex-col space-y-4 p-4">
      <WakaTimeCard class="wakatime-card p-4 h-max rounded-md shadow-md"></WakaTimeCard>
      <V2EXCard class="h-max"></V2EXCard>
      <SspaiCard class="h-max"></SspaiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorldLineCard from '~/newTab/views/worldLine/Card.vue'
import WakaTimeCard from '~/newTab/views/wakaTime/Card.vue'
import BookMarkList from '~/newTab/views/bookmark/List.vue'
import SettingList from '~/newTab/views/setting/Setting.vue'
import SportList from '~/newTab/views/sport/List.vue'
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

:is(.timeline-card, .ddrk-card, .sport-list)::-webkit-scrollbar {
  display: none;
}
:is(.timeline-card:hover, .ddrk-card:hover, .sport-list:hover)::-webkit-scrollbar {
  display: none;
}

.active-tab {
  background-color: gray;
  color: white;
}
</style>
