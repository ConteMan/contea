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
    class="p-4 max-w-[320px] rounded-md bg-transparent flex flex-col gap-1"
  >
    <div class="uppercase">
      {{ title }}
    </div>
    <div class="cursor-pointer hover:(underline underline-offset-2)" @click="openSite(`${config.spaceSite}/${profile.mid}`)">
      {{ `${profile.uname} / ${profile.mid} / lv${profile.level_info.current_level}` }}
    </div>
    <div>
      <span class="cursor-pointer hover:(underline underline-offset-2)" @click="openSite(`${config.spaceSite}/${profile.mid}/fans/follow`)">
        {{ `FOLLOWED ${stat.following}` }}
      </span>
      <span class="mx-1">/</span>
      <span class="cursor-pointer hover:(underline underline-offset-2)" @click="openSite(`${config.spaceSite}/${profile.mid}/fans/fans`)">
        {{ `FOLLOWER ${stat.follower}` }}
      </span>
    </div>
    <div class="uppercase">
      <span :class="[sign.success ? '' : 'text-red-400']">{{ sign.success ? 'signed' : 'not sign' }}</span>
    </div>
  </div>
</template>
