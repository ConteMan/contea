<template>
  <div
    class="p-4 flex justify-between min-w-full shadow-md rounded-md bg-gradient-to-r from-red-500"
  >
    <div v-if="loading">
      Loading ...
    </div>
    <div v-else>
      <div class="flex">
        <div>
          <div>
            {{ user.bio }}
          </div>
          <div class="mt-2 italic text-gray-500">
            updated: {{ dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex items-center text-right">
      <div
        class="cursor-pointer text-2xl text-white hover:(text-gray-400)"
        @click.stop="openSite(config.site)"
      >
        {{ config.name }}
        <span v-if="!loading" class="ml-1 text-sm" :class="login ? 'text-green-600' : 'text-red-600'">
          ●
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
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
