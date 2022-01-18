<template>
  <Card v-if="!loading" class="flex flex-col justify-between">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div>Followers <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.data.login}?tab=followers`)">{{ user.data.followers }}</span></div>
        <div>Following <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.data.login}?tab=following`)">{{ user.data.following }}</span></div>
      </div>
      <div class="flex flex-col justify-center">
        <div
          class="cursor-pointer text-2xl text-white hover:(text-gray-400)"
          @click.stop="openSite(config.site)"
        >
          {{ config.name }}
        </div>
      </div>
    </div>
    <div class="pt-2">
      <div>Repos <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://github.com/${user.data.login}?tab=repositories`)">{{ user.data.owned_private_repos }} / {{ user.data.public_repos }}</span></div>
      <div>Gists <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`https://gist.github.com/${user.data.login}`)">{{ user.data.private_gists }} / {{ user.data.public_gists }}</span></div>
    </div>
  </Card>
</template>
<script setup lang="ts">
import type { Config } from '~/services/github/model'
import { openSite } from '~/utils'
import Card from '~/components/template/Card.vue'
import Github from '~/services/github'
import ConfigState from '~/models/keyValue/configState'

const module = 'github'

const data = reactive({
  loading: 0,
  config: {} as Config,
  user: {} as any,
})
const getData = async() => {
  data.loading++
  data.config = await ConfigState.getItem(module)
  data.user = await Github.me()
  data.loading--
}
getData()

const { loading, config, user } = toRefs(data)
</script>

<style>
li::marker {
  margin-right: 0 !important;
}
</style>
