<template>
  <Card v-if="!loading" class="text-white flex flex-col justify-between bg-center bg-cover .transition-opacity" :style="data.cardStyle">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col justify-center">
        <div class="cursor-default" v-html="current.text">
        </div>
        <div class="pt-3">
          <a :href="current.articleLink">{{ current.articleTitle }} <span v-if="current.articleAuthor">- {{ current.articleAuthor }}</span></a>
        </div>
        <div class="pt-3">
          <a :href="current.questionLink">{{ current.questionTitle }}</a>
        </div>
        <div class="pt-3 flex justify-between items-end">
          <span class="cursor-pointer hover:(.animate-pulse)" @click="refresh()">
            {{ current.vol }}
          </span>
          <span
            class="word-keep-all cursor-pointer font-bold text-white hover:(text-gray-400)"
            @click.stop="openSite(config.site)"
          >
            {{ config.name }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup lang="ts" name="OneCard">
import type { Config } from '~/services/one/model'
import { openSite, getRandomIntInclusive } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import ConfigState from '~/models/keyValue/configState'
import One from '~/services/one'

const module = 'one'

const data = reactive({
  loading: 1,
  config: {} as Config,
  list: {} as any,
  current: {} as any,
  cardStyle: {} as any,
})

const refresh = () => {
  data.current = Object.values(data.list)[getRandomIntInclusive(0, Object.keys(data.list).length - 1)]
  data.cardStyle = {
    'background-image': data.current.pic ? `url(${data.current.pic})` : '',
  }
}

const getData = async() => {
  data.config = await ConfigState.getItem(module)
  data.list = await One.list()
  refresh()
  data.loading--
}
getData()

const { loading, config, current } = toRefs(data)
</script>
