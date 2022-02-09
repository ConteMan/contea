<template>
  <Card class="flex flex-col justify-between">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <template v-else>
      <div class="flex flex-row justify-between items-end">
        <div v-if="!Object.keys(data.user).length || data.error" class="text-red-600 font-medium">
          请检查 Token
        </div>
        <template v-else>
          <div class="flex flex-row justify-center items-center space-x-2">
            <div class="pr-1">
              <div title="Repos">
                <span class="text-xs">REPOS</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/${user.login}?tab=repositories`)">
                {{ user.owned_private_repos }} / {{ user.public_repos }}
              </div>
            </div>
            <div class="pr-1">
              <div title="Gists">
                <span class="text-xs">GISTS</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.gist}/${user.login}`)">
                {{ user.private_gists }} / {{ user.public_gists }}
              </div>
            </div>
            <div class="pr-1">
              <div title="Stars">
                <span class="text-xs">STARS</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/${user.login}?tab=stars`)">
                {{ user.starred }}
              </div>
            </div>
          </div>
        </template>
        <div class="flex flex-col justify-between">
          <div class="flex flex-row-reverse w-full opacity-0 hover:(opacity-100 transition-opacity duration-200)" :class="{'!opacity-100': showExtend}">
            <mdi-information-outline class="text-white cursor-pointer" @click="showExtend = !showExtend" />
            <mdi-refresh class="text-white cursor-pointer mr-2" :class="{'animate-spin': refreshLoading }" @click="getData(true)" />
          </div>
          <div
            class="cursor-pointer font-bold text-xl text-white select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
            @click.stop="openSite(config.site)"
          >
            {{ config.name }}
          </div>
        </div>
      </div>

      <!-- 扩展信息 -->
      <transition name="fade">
        <div v-if="showExtend" class="pt-4 flex flex-col">
          <div class="flex flex-row items-center space-x-2">
            <div class="pr-1">
              <div title="FOLLOWERS">
                <span class="text-xs">FOLLOWERS</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse)" @click="openSite(`${config.site}/${user.login}?tab=followers`)">
                {{ user.followers }}
              </div>
            </div>
            <div class="pr-1">
              <div title="FOLLOWING">
                <span class="text-xs">FOLLOWING</span>
              </div>
              <div class="cursor-pointer hover:(duration-200 animate-pulse) ml-1" @click="openSite(`${config.site}/${user.login}?tab=following`)">
                {{ user.following }}
              </div>
            </div>
          </div>
          <div class="space-y-1 text-size-[12px] text-gray-400 italic text-right">
            <div>Updated / Expried</div>
            <div>{{ dayjs(extendInfo.ca_updated_at).format('DD HH:mm:ss') }} / {{ dayjs(extendInfo.ca_expried_at).format('DD HH:mm:ss') }}</div>
          </div>
        </div>
      </transition>
    </template>
  </Card>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { openSite } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import ConfigState from '~/models/keyValue/configState'
import type { Config } from '~/services/github/model'
import Github from '~/services/github'

const module = 'github'

const data = reactive({
  loading: true,
  refreshLoading: false,
  config: {} as Config,
  user: {} as any,
  showExtend: false,
  extendInfo: {} as any,
  error: false,
})

const init = async() => {
  data.config = await ConfigState.getItem(module)
  if (!data.config.token)
    data.error = true
}
init()

const getData = async(refresh = false) => {
  if (refresh)
    data.refreshLoading = true

  try {
    const { ca_updated_at, ca_expried_at, data: userData } = await Github.user(refresh)
    data.user = userData
    data.extendInfo = { ca_updated_at, ca_expried_at }
  }
  catch (e) {
    data.error = true
  }

  if (refresh)
    data.refreshLoading = false
  else
    data.loading = false
}
getData()

const { loading, refreshLoading, config, user, showExtend, extendInfo } = toRefs(data)
</script>
