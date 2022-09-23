<script setup lang="ts">
import type { Config } from '@services/bilibili/model'
import { ConfigModel } from '@models/index'
import { openSite } from '@utils/index'
import BilibiliService from '@services/bilibili'

const module = 'bilibili'
const title = 'Bilibili'
const data: any = reactive({
  loading: true,

  config: {} as Config,
  profile: {},
  stat: {},
  card: {},
  sign: {},
})
const { loading, config, profile, stat, sign } = toRefs(data)

const getConfig = async () => {
  const res = await ConfigModel.getItem(module)
  if (res)
    data.config = res
}
getConfig()

const getData = async () => {
  const res = await BilibiliService.moduleInfo()
  if (!res)
    return false
  const { profile, stat, card, sign } = res
  data.profile = profile
  data.stat = stat
  data.card = card
  data.sign = sign

  data.loading = false
}
getData()
</script>

<template>
  <div
    v-if="!loading"
    class="p-4 max-w-[320px] overflow-auto rounded-md bg-gray-400 bg-opacity-20 flex flex-col hover:(bg-opacity-40)"
  >
    <div class="text-xl font-bold mb-2">
      {{ title }}
    </div>
    <div class="cursor-pointer hover:(underline underline-offset-2)" @click="openSite(`${config.spaceSite}/${profile.mid}`)">
      {{ profile.uname }}
    </div>
    <div>
      {{ profile.mid }}
    </div>
    <div class="flex items-center">
      <span>lv {{ profile.level_info.current_level }} ({{ profile.level_info.current_exp }} / {{ profile.level_info.current_min }})</span>
    </div>
    <div>
      <span class="text-xs mr-2">FOLLOWED / FOLLOWER</span>
      <span class="cursor-pointer mr-1 hover:(underline underline-offset-2)" @click="openSite(`${config.spaceSite}/${profile.mid}/fans/follow`)">
        {{ stat.following }}
      </span>
      <span class="mr-1">/</span>
      <span class="cursor-pointer hover:(underline underline-offset-2)" @click="openSite(`${config.spaceSite}/${profile.mid}/fans/fans`)">
        {{ stat.follower }}
      </span>
    </div>
    <div class="mt-2 uppercase">
      {{ sign.date }} / <span :class="[sign.success ? '' : 'text-red-400']">{{ sign.success ? 'signed' : 'not sign' }}</span>
    </div>
  </div>
</template>
