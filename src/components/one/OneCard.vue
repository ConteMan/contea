<template>
  <Card v-if="!loading" class="text-white flex flex-col justify-between bg-center bg-cover .transition-opacity" :style="data.cardStyle">
    <div>
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
          <span class="cursor-pointer hover:(.animate-pulse)" @click="refresh(false)">
            {{ current.vol }}
          </span>
          <span
            class="cursor-pointer font-bold text-xl text-white select-none hover:(underline underline-offset-2 duration-200 animate-pulse)"
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
    'background-image': data.current.pic ? `url(${data.current.pic})` : '',
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
