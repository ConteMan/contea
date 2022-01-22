<template>
  <Card v-if="!loading" class="flex flex-col justify-between">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div>Followers <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`${config.site}/user/${user.user_id}/followers`)">{{ user.follower_count }}</span></div>
        <div>Following <span class="cursor-pointer hover:(text-white) ml-1" @click="openSite(`${config.site}/user/${user.user_id}/following`)">{{ user.followee_count }}</span></div>
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
  </Card>
</template>
<script setup lang="ts" name="JuejinCard">
import type { Config } from '~/services/juejin/model'
import { openSite } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import ConfigState from '~/models/keyValue/configState'
import Juejin from '~/services/juejin'

const module = 'juejin'

const data = reactive({
  loading: 1,
  config: {} as Config,
  user: {} as any,
})
const getData = async() => {
  data.config = await ConfigState.getItem(module)
  data.user = await Juejin.user()
  data.loading--
}
getData()

const { loading, config, user } = toRefs(data)
</script>
