<script setup lang="ts" name="OriginalPost">
import configState from '@models/keyValue/configState'
import type { Config } from '@services/zhihu/model'

const props = defineProps({
  data: {} as any,
})

const module = 'zhihu'

const { data } = toRefs(props)

const moduleData = reactive({
  config: {} as Config,
})
const { config } = toRefs(moduleData)
const init = async () => {
  moduleData.config = await configState.getItem(module)
}
init()
</script>

<template>
  <div class="p-2 cursor-default">
    <a :href="`${config.site}/question/${data.target.id}`">
      {{ data.target.title }}
    </a>
  </div>
</template>

<style scoped>
.pic-container {
  grid-auto-rows: minmax(120px, 120px);
}
</style>
