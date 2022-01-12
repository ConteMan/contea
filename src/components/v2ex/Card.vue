<template>
  <div
    class="p-4 flex justify-between shadow-md rounded-md bg-gradient-to-br from-red-500"
  >
    <div v-if="loading">
      Loading ...
    </div>
    <div v-else>
      <div>
        <div class="flex items-center">
          <mdi-fire />
          <span class="ml-2">{{ info.dau }}</span>
        </div>
        <div class="flex items-center">
          <mdi-gold />
          <span class="ml-2">{{ info.balance?.gold }} / {{ info.balance?.silver }} / {{ info.balance?.bronze }}</span>
        </div>
        <div v-if="info.mission?.date === dayjs().format('YYYY-MM-DD')" class="flex items-center">
          <mdi-calendar-text />
          <span class="ml-2">{{ info.mission?.days }} 天</span>
        </div>
        <div v-else>
          <a-button size="small" @click="mission()">
            签到
          </a-button>
        </div>
      </div>
    </div>
    <div class="relative flex items-center text-right">
      <div
        class="cursor-pointer text-2xl text-white hover:(text-gray-400)"
        @click.stop="openSite(config.site)"
      >
        {{ config.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { Config, User } from '~/services/v2ex/model'
import { openSite } from '~/utils'
import v2ex from '~/services/v2ex'

const config = ref({} as Config)
const info = ref({} as User)
const loading = ref(true)

const getInfo = async() => {
  loading.value = true
  config.value = await v2ex.getConfig()
  info.value = await v2ex.user()
  loading.value = false
}
getInfo()

const mission = async() => {
  await v2ex.mission()
  getInfo()
}
</script>
