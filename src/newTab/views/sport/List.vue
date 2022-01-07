<template>
  <div>
    <div v-for="(day, key) in matches" :key="key">
      <div class="pt-2 pb-2 text-xl border-b border-b-black">
        {{ key }}
      </div>
      <template v-for="item in (day as any)" :key="item.mid">
        <div class="pt-2 pb-1">
          <span>{{ item.leftName }}</span>
          <template v-if="item.rightName">
            <span class="pl-2">{{ item.leftGoal }}</span>
            <span class="pl-1 pr-1">VS</span>
            <span class="pr-2">{{ item.rightGoal }}</span>
            <span>{{ item.rightName }}</span>
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
<script setup lang="ts">
import dayjs from 'dayjs'
import KBS from '~/services/sport/kbs'

const matches = ref({})

const getMatches = async() => {
  matches.value = await KBS.matches('hot')
}

getMatches()
</script>
