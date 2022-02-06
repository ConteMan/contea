<template>
  <Card class="p-4 flex justify-between">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <div v-else class="flex flex-row justify-center">
      <div v-if="!login">
        请登录
      </div>
      <div v-else class="flex items-center leading-none">
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
  </Card>
</template>

<script lang="ts" setup>
import { openSite } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import type { Config, User } from '~/services/sspai/model'
import base from '~/services/sspai'

const data = reactive({
  loading: true,
  config: {} as Config,
  login: false,
  user: {} as User,
})
const { loading, config, login, user } = toRefs(data)

const getInfo = async() => {
  data.config = await base.getConfig()
  data.login = await base.loginCheck()
  if (data.login)
    data.user = await base.user()
  data.loading = false
}
getInfo()
</script>
