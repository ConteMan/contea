<template>
  <div class="p-4 flex justify-between shadow-md rounded-md bg-gradient-to-br from-red-500">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <div v-else>
      <div v-if="login">
        <div class="flex items-center leading-none my-1">
          <mdi-fire />
          <span class="ml-2">{{ user?.dau }}</span>
        </div>
        <div class="flex items-center leading-none my-1">
          <mdi-gold />
          <span class="ml-2">{{ user?.balance?.gold }} / {{ user?.balance?.silver }} / {{ user?.balance?.bronze }}</span>
        </div>
        <div class="flex items-center leading-none my-1">
          <mdi-calendar-text />
          <span v-if="showDays(user?.mission?.date)" class="ml-2">
            {{ user?.mission?.days }} DAYS
          </span>
          <template v-else>
            <a v-if="!missionLoading" class="ml-2 text-white font-medium cursor-pointer" @click="mission()">
              [ Sign ]
            </a>
            <span v-else class="ml-2 text-white font-medium cursor-default">
              Ing ...
            </span>
          </template>
        </div>
      </div>
      <div v-else>
        未登录
      </div>
    </div>
    <div class="relative flex items-end text-right">
      <div
        class="cursor-pointer font-bold text-xl text-white select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
        @click.stop="openSite(config.site)"
      >
        {{ config.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Config, Module, User } from '~/services/v2ex/model'
import { openSite } from '~/utils'
import configState from '~/models/keyValue/configState'
import v2ex from '~/services/v2ex'

const module = 'v2ex'

const data = reactive({
  loading: true,
  config: {} as Config,
  login: false,
  moduleData: {} as Module,
  user: {} as User | undefined,
  missionLoading: false,
})

const getInfo = async() => {
  data.loading = true

  data.config = await configState.getItem(module)
  const res = await v2ex.user()
  data.moduleData = res
  data.user = res.data
  data.login = res.ca_login ?? false

  data.loading = false
}
getInfo()

const { loading, config, user, login, missionLoading } = toRefs(data)

const mission = async() => {
  data.missionLoading = true

  await v2ex.mission()
  await getInfo()

  data.missionLoading = false
}

const showDays = (date: string | undefined) => {
  if (!date)
    return false

  if (!dayjs().isAfter(dayjs().format('YYYY-MM-DD 06:00:00')))
    return true

  if (date === dayjs().format('YYYY-MM-DD'))
    return true
  return false
}
</script>
