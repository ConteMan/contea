<script setup lang="ts">
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import gooooal from '@services/sport/modules/football/gooooal'

const gooooalTest = async (type: string, params: any) => {
  let res
  if (type === 'rankList')
    res = await gooooal.getCompetitionRank(params)
  // eslint-disable-next-line no-console
  console.log(res)
}
</script>

<template>
  <WorldlineContent>
    <template #bar />

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4">
        <div class="p-4 rounded-md bg-gray-400 bg-opacity-20">
          <div>体育 / 足球 / 雪缘园</div>
          <div class="mt-6 flex flex-wrap gap-4">
            <n-button
              size="small" @click="gooooalTest('rankList', {
                lid: 4,
              })"
            >
              RankList
            </n-button>
          </div>
        </div>
      </div>
    </template>
  </WorldlineContent>
</template>
