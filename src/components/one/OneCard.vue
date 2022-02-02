<template>
  <Card v-if="!loading" class="text-gray-700 flex flex-col justify-between bg-center bg-cover transition-opacity" :style="data.cardStyle">
    <div>
      <div class="flex flex-col justify-center">
        <div class="cursor-default first-letter:(text-lg font-bold mr-[2px])" v-html="current.text"></div>
        <div class="pt-1">
          《
          <a class="text-gray-700 hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="current.articleLink">
            {{ current.articleTitle }}
          </a>
          》
          <span v-if="current.articleAuthor"> {{ current.articleAuthor }}</span>
        </div>
        <div class="pt-1">
          <a class="text-gray-700 hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="current.questionLink">
            {{ current.questionTitle }}
          </a>
        </div>
        <div class="pt-4 flex">
          <div class="flex-grow-0 cursor-pointer inline-block hover:(animate-pulse)" @click="refresh(false)">
            {{ current.vol }}
          </div>
          <div class="flex-grow text-right inline-block w-full font-bold opacity-0 hover:(underline underline-offset-2 animate-pulse opacity-100 transition-opacity duration-200)">
            <a :href="config.site">{{ config.name }}</a>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup lang="ts" name="OneCard">
import type { Config } from '~/services/one/model'
import { getRandomIntInclusive } from '~/utils'
import Card from '~/components/template/TemplateCard.vue'
import ConfigState from '~/models/keyValue/configState'
import One from '~/services/one'

const module = 'one'

const data = reactive({
  loading: 1,
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
  data.config = await ConfigState.getItem(module)
  data.data = await One.list()
  data.list = data.data.data
  refresh()
  data.loading--
}
getData()

const { loading, config, current } = toRefs(data)
</script>
