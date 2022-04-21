<template>
  <Card class="flex flex-col justify-between bg-center bg-cover transition-opacity" :style="data.cardStyle">
    <div v-if="loading" class="duration-200 animate-pulse">
      ...
    </div>
    <div v-else>
      <div class="flex flex-col justify-center">
        <div class="cursor-default" v-html="current.text" />
        <div class="pt-1">
          《
          <a class="hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="current.articleLink">
            {{ current.articleTitle }}
          </a>
          》
          <span v-if="current.articleAuthor"> {{ current.articleAuthor }}</span>
        </div>
        <div class="pt-1">
          <a class="hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="current.questionLink">
            {{ current.questionTitle }}
          </a>
        </div>
        <div class="pt-4 flex justify-between">
          <div class="cursor-pointer inline-block hover:(animate-pulse)" @click="refresh(false)">
            {{ current.vol }}
          </div>
          <div
            class="text-right cursor-pointer inline-block font-bold opacity-0 hover:(underline underline-offset-2 animate-pulse opacity-100 duration-200)"
            @click.stop="openSite(config.site)"
          >
            {{ config.name }}
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup lang="ts" name="OneCard">
import configState from '@models/keyValue/configState'
import { getRandomIntInclusive, openSite } from '@utils/index'
import type { Config } from '@services/one/model'
import One from '@services/one'
import Card from '~/components/template/TemplateCard.vue'

const module = 'one'

const data = reactive({
  loading: true,
  config: {} as Config,
  data: {} as any,
  list: {} as any,
  currentIndex: 0,
  current: {} as any,
  cardStyle: {} as any,
})

const refresh = (init = true) => {
  let index = 0
  if (init)
    index = getRandomIntInclusive(0, Object.keys(data.list).length - 1)
  else
    index = data.currentIndex + 1 > Object.keys(data.list).length - 1 ? 0 : data.currentIndex + 1

  data.currentIndex = index
  data.current = Object.values(data.list)[index]
  data.cardStyle = {
    'background-image': data.current.pic ? `-webkit-cross-fade(url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==), url(${data.current.pic}), 20%)` : '',
  }
}

const getData = async() => {
  data.config = await configState.getItem(module)
  data.data = await One.list()
  data.list = data.data.data
  refresh()
  data.loading = false
}
getData()

const { loading, config, current } = toRefs(data)
</script>
