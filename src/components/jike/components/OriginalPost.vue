<template>
  <div class="py-1 pb-1 cursor-default">
    <div class="font-medium">
      <a class="hover:(duration-200 animate-pulse)" :href="`${config.site}/u/${data.user.username}`">{{ data.user.screenName }}</a>
    </div>
    <div>
      <n-ellipsis v-if="!data.isRepost" line-clamp="1" :tooltip="false" class="mt-1 text-gray-400 text-xs" :title="data.user.briefIntro">
        {{ data.user.briefIntro }}
      </n-ellipsis>
    </div>
  </div>
  <div v-if="data.content" class="py-1 pb-2" v-html="contentDeal(data)">
  </div>
  <div v-if="data.pictures.length" class="pic-container w-full flex flex-wrap justify-start gap-2 mb-2 p-2">
    <n-image
      v-for="picItem in data.pictures"
      :key="picItem.picUrl"
      :src="picItem.picUrl ? picItem.picUrl : picItem.thumbnailUrl"
      object-fit="contain"
      class="max-w-[160px] max-h-[160px]"
    />
  </div>
</template>

<script setup lang="ts" name="OriginalPost">
import type { Config } from '~/services/jike/model'
import configState from '~/models/keyValue/configState'

const module = 'jike'

const props = defineProps({
  data: {} as any,
})
const { data } = toRefs(props)

const moduleData = reactive({
  config: {} as Config,
})
const { config } = toRefs(moduleData)
const init = async() => {
  moduleData.config = await configState.getItem(module)
}
init()

const contentDeal = (data: any) => {
  let content = data.content.replace(/\n/gi, '<br>')
  if (data?.urlsInText && data?.urlsInText.length) {
    data.urlsInText.forEach((urlItem: any) => {
      // 站内链接
      if (/^jike:\/\/(.){1,}/.test(urlItem.url)) {
        const userId = (urlItem.url).replace('jike://page.jk/user/', '')
        content = content.replace(urlItem.originalUrl, `<a class="px-1 cursor-pointer underline underline-offset-2 hover:(duration-200 animate-pulse)" href="${moduleData.config.site}/u/${userId}">${urlItem.title}</a>`)
      }
      else {
        content = content.replace(urlItem.originalUrl, `<a class="px-1 cursor-pointer underline underline-offset-2 hover:(duration-200 animate-pulse)" href="${urlItem.originalUrl}">${urlItem.title}</a>`)
      }
    })
  }
  return content
}
</script>

<style scoped>
.pic-container {
  grid-auto-rows: minmax(120px, 120px);
}
</style>
