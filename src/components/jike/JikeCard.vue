<template>
  <Card v-if="!loading" class="flex flex-col justify-between bg-center bg-cover" :style="data.cardStyle">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div><span class="cursor-pointer hover:(text-white) ml-1">{{ user.profile.statsCount.followingCount }}</span> 关注</div>
        <div><span class="cursor-pointer hover:(text-white) ml-1">{{ user.profile.statsCount.followedCount }}</span> 被关注</div>
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
  </Card>
</template>
<script setup lang="ts">
import type { Config } from '~/services/jike/model'
import { openSite } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import Jike from '~/services/jike'
import ConfigState from '~/models/keyValue/configState'

const module = 'jike'

const data = reactive({
  loading: 1,
  config: {} as Config,
  user: {} as any,
  cardStyle: {} as any,
})
const getData = async() => {
  data.config = await ConfigState.getItem(module)
  data.user = await Jike.me()
  data.cardStyle = {
    'background-image': data.user.profile.backgroundImage.picUrl ? `linear-gradient(45deg, rgba(255, 224, 18, 0.7), rgba(255, 224, 18, 0.7)), url(${data.user.profile.backgroundImage.picUrl})` : '',
  }
  data.loading--
}
getData()

const { loading, config, user } = toRefs(data)
</script>
