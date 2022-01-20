<template>
  <div class="py-1 pb-2">
    <span>
      {{ data.user.screenName }}
    </span>
  </div>
  <div v-if="data.content" class="py-1 pb-2">
    {{ data.content }}
  </div>
  <div v-if="data.pictures.length" class="pic-container w-full grid grid-cols-3 auto-rows-fr gap-2 mb-2 p-2">
    <div v-for="picItem in data.pictures" :key="picItem.picUrl" class="pic-item max-h-[320px] w-full h-full bg-cover bg-center rounded-sm" :style="{ 'background-image': 'url(' + picItem.thumbnailUrl + ')'}"></div>
  </div>
</template>

<script setup lang="ts" name="OriginalPost">
const props = defineProps({
  data: {} as any,
})
const { data } = toRefs(props)
</script>

<style scoped>
.pic-container {
  grid-auto-rows: minmax(120px, 120px);
}
</style>
