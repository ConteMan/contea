<script setup lang="ts">
import Module from '@services/base/module'
import Bilibili from './modules/Bilibili.vue'

const data = reactive({
  cards: [] as string[],
})

const { cards } = toRefs(data)

const getCards = async () => {
  const res = await Module.getCards()
  data.cards = res
}
getCards()
</script>

<template>
  <div class="w-[60%] h-full flex justify-start items-center p-8">
    <Bilibili v-if="cards.includes('bilibili')" />
  </div>
</template>
