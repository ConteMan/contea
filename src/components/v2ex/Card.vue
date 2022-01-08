<template>
  <div
    class="p-4 flex justify-between shadow-md rounded-md bg-gradient-to-r from-red-500"
  >
    <div v-if="loading">
      Loading ...
    </div>
    <div v-else>
      <div>
        <div>第 {{ info.id }} 号会员</div>
        <div>今日活跃 {{ info.dau }}</div>
        <div>{{ info.balance?.gold }} 金 {{ info.balance?.silver }} 银 {{ info.balance?.bronze }} 铜</div>
      </div>
    </div>
    <div class="relative flex items-center text-right">
      <div
        class="cursor-pointer text-2xl text-white hover:(text-gray-400)"
        @click.stop="openSite(config.site)"
      >
        {{ config.name }}
        <span v-if="!loading" class="ml-1 text-sm" :class="info.login ? 'text-green-600' : 'text-red-600'">
          ●
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { openSite } from '~/utils'
import v2ex from '~/services/v2ex'
import type { Config, User } from '~/services/v2ex/model'

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
</script>
