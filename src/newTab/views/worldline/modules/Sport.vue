<script setup lang="ts">
import type { CompetitionCatType, CompetitionItem } from '@services/sport/modules/football'
import type { RankItem } from '@services/sport/modules/football/gooooal'
import Football from '@services/sport/modules/football'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import type { DataTableColumns } from 'naive-ui'
import type { VNodeChild } from 'vue'

interface Data {
  loading: string
  mode: 'team' | 'competition'
  competitions: CompetitionItem[]
  competition: number
  competitionCats: CompetitionCatType
  competitionCat: string
  competitionRankList: RankItem[]
}
type ModeType = {
  name: string
  value: Data['mode']
}[]

const MODES: ModeType = [
  {
    name: '球队',
    value: 'team',
  },
  {
    name: '联赛',
    value: 'competition',
  },
]

const data: Data = reactive({
  loading: '',
  mode: 'competition',

  competitions: [],
  competition: 1,

  competitionCats: [],
  competitionCat: 'rankList',
  competitionRankList: [],
})

const { loading, mode, competitions, competition, competitionCats, competitionCat, competitionRankList } = toRefs(data)

const getConst = () => {
  data.competitions = Object.values(Football.COMPETITIONS)
  data.competition = data.competitions[0].id
  data.competitionCats = Football.COMPETITION_CATS
  data.competitionCat = data.competitionCats[0].key
}
getConst()

const getCompetitionRankList = async () => {
  const res = await Football.getCompetitionRank(data.competition)
  if (res)
    data.competitionRankList = res.data
}
getCompetitionRankList()

const competitionRankColumn: DataTableColumns<RankItem> = [
  {
    title: '排行',
    key: 'sort',
    align: 'center',
  },
  {
    title: '球队名称',
    key: 'team_name',
  },
  {
    title: '积分',
    key: 'points',
    align: 'center',
    sorter: (row1, row2) => row1.points - row2.points,
  },
  {
    title: '已赛',
    key: 'games',
    align: 'center',
    sorter: (row1, row2) => row1.games - row2.games,
  },
  {
    title: '胜',
    key: 'win',
    align: 'center',
    sorter: (row1, row2) => row1.win - row2.win,
  },
  {
    title: '平',
    key: 'draw',
    align: 'center',
    sorter: (row1, row2) => row1.draw - row2.draw,
  },
  {
    title: '败',
    key: 'loss',
    align: 'center',
    sorter: (row1, row2) => row1.loss - row2.loss,
  },
  {
    title: '进球',
    key: 'goal',
    align: 'center',
    sorter: (row1, row2) => row1.goal - row2.goal,
  },
  {
    title: '失球',
    key: 'loss_goal',
    align: 'center',
    sorter: (row1, row2) => row1.loss_goal - row2.loss_goal,
  },
  {
    title: '净胜球',
    key: 'diff_goal',
    align: 'center',
    sorter: (row1, row2) => row1.diff_goal - row2.diff_goal,
  },
  {
    title: '最近赛果',
    key: 'recent_result',
    render: (rowData) => {
      const content: VNodeChild[] = []
      rowData.recent_result.forEach((item) => {
        if (item === 'win')
          content.push(h('span', { class: 'text-red-500' }, 'W'))
        if (item === 'draw')
          content.push(h('span', { class: 'text-gray-500' }, 'D'))
        if (item === 'loss')
          content.push(h('span', { class: 'text-green-500' }, 'L'))
      })
      return h('div', { class: 'flex gap-2' }, content)
    },
  },
  {
    title: '下场对手',
    key: 'next_match_team_name',
  },
]
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <a class="cursor-pointer py-2 px-4 flex items-center">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </template>

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4">
        <div class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex justify-start items-center gap-6">
          <div
            v-for="item in MODES" :key="item.value"
            class="cursor-pointer"
            :class="{ 'underline decoration-gray-500/50 decoration-2 underline-offset-6': mode === item.value }"
            @click="() => data.mode = item.value"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="mode === 'competition'"
          class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex justify-start items-center gap-4"
        >
          <div
            v-for="item in competitions" :key="item.id"
            class="cursor-pointer"
            :class="{ 'underline decoration-gray-500/50 decoration-2 underline-offset-6': competition === item.id }"
            @click="() => data.competition = item.id"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="mode === 'competition'"
          class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex flex-col gap-4"
        >
          <div class="flex justify-start items-center gap-4">
            <div
              v-for="item in competitionCats" :key="item.key"
              class="cursor-pointer"
              :class="{ 'underline decoration-gray-500/50 decoration-2 underline-offset-6': competitionCat === item.key }"
              @click="() => data.competitionCat = item.key"
            >
              {{ item.name }}
            </div>
          </div>
          <div v-if="competitionRankList.length" class="w-full">
            <n-data-table
              :columns="competitionRankColumn"
              :data="competitionRankList"
              :bordered="false"
              size="medium"
              striped
            />
          </div>
        </div>
      </div>
    </template>
  </WorldlineContent>
</template>
