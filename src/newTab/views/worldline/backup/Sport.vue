<script setup lang="ts">
import dayjs from 'dayjs'
import KBS from '@services/sport/modules/kbs'

const matches = ref({})

const getMatches = async () => {
  matches.value = await KBS.matches('hot')
}
getMatches()

const important = (name: string) => {
  return [
    'TES', 'LNG', 'V5', 'WBG', 'RNG', 'EDG', 'FPX',
    '曼城', '切尔西', '曼联', '巴黎圣日耳曼',
    '拜仁慕尼黑',
    '皇家马德里',
    '湖人',
  ].includes(name)
}
</script>

<template>
  <div class="overflow-y-auto">
    <div v-for="(day, key) in matches" :key="key">
      <div class="pt-2 pb-2 text-xl border-b border-b-black">
        {{ key }}
      </div>
      <template v-for="item in (day as any)" :key="item.mid">
        <div class="pt-2 pb-1">
          <span :class="{ 'text-red-500 font-bold': important(item.leftName) }">{{ item.leftName }}</span>
          <template v-if="item.rightName">
            <span class="pl-2">{{ item.leftGoal }}</span>
            <span class="pl-1 pr-1">VS</span>
            <span class="pr-2">{{ item.rightGoal }}</span>
            <span :class="{ 'text-red-500 font-bold': important(item.rightName) }">{{ item.rightName }}</span>
          </template>
          <span class="pl-4 text-gray-400">
            {{ dayjs(item.startTime).format('HH:mm') }}
          </span>
          <span class="pl-2 text-gray-400">
            {{ item.matchDesc }}
          </span>
          <a :href="item.webUrl" class="pl-2 text-gray-400">...</a>
        </div>
      </template>
    </div>
  </div>
</template>
