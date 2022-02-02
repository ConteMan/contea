<template>
  <Card v-if="!loading" class="flex flex-col justify-between">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div>Followers <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.login}?tab=followers`)">{{ user.followers }}</span></div>
        <div>Following <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.login}?tab=following`)">{{ user.following }}</span></div>
      </div>
      <div class="flex flex-col justify-center">
        <div
          class="cursor-pointer font-bold text-xl text-white hover:(underline underline-offset-2 duration-200 animate-pulse)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
    <div class="pt-2">
      <div>Repos <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.login}?tab=repositories`)">{{ user.owned_private_repos }} / {{ user.public_repos }}</span></div>
      <div>Gists <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://gist.github.com/${user.login}`)">{{ user.private_gists }} / {{ user.public_gists }}</span></div>
      <div>Stars <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.login}?tab=stars`)">{{ user.starred }}</span></div>
    </div>
  </Card>
</template>
<script setup lang="ts">
import { openSite } from '~/utils'
import ConfigState from '~/models/keyValue/configState'
import type { Config } from '~/services/github/model'
import Card from '~/components/template/TemplateCard.vue'
import Github from '~/services/github'

const module = 'github'

const data = reactive({
  loading: 0,
  config: {} as Config,
  user: {} as any,
})
const getData = async() => {
  data.loading++
  data.config = await ConfigState.getItem(module)
  data.user = await Github.user()
  data.loading--
}
getData()

const { loading, config, user } = toRefs(data)
</script>
