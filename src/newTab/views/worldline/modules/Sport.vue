<script setup lang="ts">
import type { CompetitionCatType, CompetitionItem, TeamItem } from '@services/sport/modules/football'
import type { RankItem } from '@services/sport/modules/football/gooooal'
import Football from '@services/sport/modules/football'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import type { DataTableColumns } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { sleep } from '~/utils'

interface Data {
  loading: number
  moduleType: string
  mode: 'team' | 'competition'
  competitions: CompetitionItem[]
  competition: number
  competitionCats: CompetitionCatType
  competitionCat: typeof Football.COMPETITION_CATS[number]['key']
  competitionRankList: RankItem[]
  teams: TeamItem[]
}
type ModeType = {
  name: string
  value: Data['mode']
}[]

const MODES: ModeType = [
  {
    name: '联赛',
    value: 'competition',
  },
  {
    name: '球队',
    value: 'team',
  },
]
const MODULE_TYPES: {
  key: string
  name: string
}[] = [
  {
    name: '足球',
    key: 'football',
  },
]

const data: Data = reactive({
  loading: 0,
  moduleType: 'football',
  mode: 'competition',

  competitions: [],
  competition: 1,

  competitionCats: [],
  competitionCat: 'rankList',
  competitionRankList: [],

  teams: [],
})

const {
  loading, moduleType, mode, competitions, competition, competitionCats, competitionCat, competitionRankList,
  teams,
} = toRefs(data)

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
          content.push(h('span', { class: 'text-red-500 w-[15px]' }, '胜'))
        if (item === 'draw')
          content.push(h('span', { class: 'text-gray-500 w-[15px]' }, '平'))
        if (item === 'loss')
          content.push(h('span', { class: 'text-green-500 w-[15px]' }, '负'))
      })
      return h('div', { class: 'flex gap-2' }, content)
    },
  },
  {
    title: '下场对手',
    key: 'next_match_team_name',
  },
]

const getTeams = async () => {
  const res = await Football.getTeams(data.competition)
  if (!res)
    return false
  data.teams = res
}

const dealRankList = async () => {
  await getCompetitionRankList()
}

const dealChange = async () => {
  if (data.mode === 'team')
    await getTeams()

  if (data.mode === 'competition') {
    if (data.competitionCat === 'rankList')
      await dealRankList()
  }
}

const changeMode = async (mode: Data['mode']) => {
  data.mode = mode
  await dealChange()
}

const changeCompetition = async (competitionId: number) => {
  data.competition = competitionId
  await dealChange()
}

const changeModuleType = (moduleType: string) => {
  data.moduleType = moduleType
}

const refresh = async () => {
  data.loading++
  await Football.init()
  await sleep(2000)
  data.loading--
}
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <a
        class="cursor-pointer py-2 px-4 flex items-center"
        @click="refresh()"
      >
        <mdi-database-refresh :class="{ 'animate-spin': !!loading }" />
      </a>
      <div class="h-[30%] mx-4 border-l border-l-gray-400 opacity-20" />
      <template v-for="item in MODULE_TYPES" :key="item.key">
        <div
          class="py-2 px-2 cursor-pointer opacity-60"
          :class="[moduleType === item.key ? 'text-red-500 !opacity-100' : '']"
          @click="changeModuleType(item.key)"
        >
          {{ item.name }}
        </div>
      </template>
    </template>

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex flex-col gap-4">
        <div class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex justify-start items-center gap-6">
          <div
            v-for="item in MODES" :key="item.value"
            class="cursor-pointer"
            :class="{ 'underline decoration-gray-500/50 decoration-2 underline-offset-6': mode === item.value }"
            @click="changeMode(item.value)"
          >
            {{ item.name }}
          </div>
        </div>

        <div
          class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex justify-start items-center gap-4"
        >
          <div
            v-for="item in competitions" :key="item.id"
            class="cursor-pointer"
            :class="{ 'underline decoration-gray-500/50 decoration-2 underline-offset-6': competition === item.id }"
            @click="changeCompetition(item.id)"
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

        <div
          v-if="mode === 'team' && data.teams.length"
          class="p-4 rounded-md bg-gray-400 bg-opacity-20 flex justify-start items-center flex-wrap gap-4"
        >
          <div
            v-for="item in teams" :key="item.g_id"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </template>
  </WorldlineContent>
</template>
