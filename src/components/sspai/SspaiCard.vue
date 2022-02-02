<template>
  <div class="p-4 flex justify-between min-w-full shadow-md rounded-md bg-gradient-to-br from-red-500">
    <div v-if="loading">
      Loading ...
    </div>
    <div v-else class="flex flex-row justify-center">
      <div class="flex items-center leading-none">
        <mdi-flash />
        <span class="ml-2">{{ user.liked_count }}</span>
      </div>
    </div>
    <div class="relative flex items-center text-right">
      <div
        class="cursor-pointer font-bold text-xl text-white hover:(underline underline-offset-2 duration-200 animate-pulse)"
        @click.stop="openSite(config.site)"
      >
        {{ config.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { openSite } from '~/utils'
import base from '~/services/sspai'
import type { Config, User } from '~/services/sspai/model'

const config = ref({} as Config)
const login = ref(false)
const user = ref({} as User)
const loading = ref(true)

const getInfo = async() => {
  loading.value = true
  config.value = await base.getConfig()
  login.value = await base.loginCheck()
  user.value = await base.user()
  loading.value = false
}

getInfo()
</script>
