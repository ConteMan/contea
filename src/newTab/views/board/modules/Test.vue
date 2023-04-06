<script setup lang="ts">
import { useNewTabState } from '@newTab/store/index'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'
import Gooooal from '@services/sport/modules/football/gooooal'
import Netease from '@services/sport/modules/football/netease'
import Football from '@services/sport/modules/football'
import GitHub from '@services/github/index'
import Board from '@services/board'
import Juejin from '@services/juejin'

const result = ref('')

const testConsole = async (type: string, params: any) => {
  let res
  if (type === 'gooooalRankList') {
    res = await Gooooal.getCompetitionRank(params)
  }
  else if (type === 'neteaseRankList') {
    res = await Netease.getCompetitionRank(params)
  }
  else if (type === 'teams') {
    res = await Football.getTeamsByRank(params)
  }
  else if (type === 'saveTeams') {
    res = await Football.saveTeams(params)
  }
  else if (type === 'rankList') {
    res = await Football.getCompetitionRank(params)
  }
  else if (type === 'footballInit') {
    res = Football.init()
  }
  else if (type === 'githubUser') {
    res = await GitHub.user(true)
  }
  else if (type === 'board') {
    res = await Board.getModuleMenu(1)
  }
  else if (type === 'board_menu_db') {
    const NewTabStore = useNewTabState()
    NewTabStore.setBoardMenuByDB()
  }
  else if (type === 'juejin_user') {
    res = await Juejin.getUser()
  }
  else if (type === 'juejin_collections') {
    res = await Juejin.getCollections()
  }
  else if (type === 'juejin_collection_detail') {
    res = await Juejin.getCollectionDetail()
  }
  // eslint-disable-next-line no-console
  console.log(res)
  result.value = res
}

const clearResult = () => {
  result.value = ''
}
</script>

<template>
  <WorldlineContent>
    <template #bar />

    <template #content>
      <div class="h-full overflow-y-auto hover-scroll pr-8 pb-8 flex gap-6">
        <div class="flex-grow flex flex-col gap-4">
          <div class="p-4 rounded-md bg-gray-400 bg-opacity-20">
            <div>体育 / 足球</div>
            <div class="mt-6 flex flex-wrap gap-4">
              <n-button
                size="small" @click="testConsole('footballInit', undefined)"
              >
                初始化
              </n-button>
              <n-button
                size="small" @click="testConsole('rankList', 1)"
              >
                英超联赛排名
              </n-button>
              <n-button
                size="small" @click="testConsole('gooooalRankList', {
                  lid: 4,
                })"
              >
                雪缘园 - 英超联赛排名
              </n-button>
              <n-button
                size="small" @click="testConsole('neteaseRankList', 82)"
              >
                网易体育 - 英超联赛排名
              </n-button>
              <n-button
                size="small" @click="testConsole('teams', 1)"
              >
                英超队伍列表
              </n-button>
              <n-button
                size="small" @click="testConsole('saveTeams', 1)"
              >
                保存 - 英超队伍列表
              </n-button>
            </div>
          </div>

          <div class="p-4 rounded-md bg-gray-400 bg-opacity-20">
            <div>GitHub</div>
            <div class="mt-6 flex flex-wrap gap-4">
              <n-button
                size="small" @click="testConsole('githubUser', undefined)"
              >
                User
              </n-button>
            </div>
          </div>

          <div class="p-4 rounded-md bg-gray-400 bg-opacity-20">
            <div>Board</div>
            <div class="mt-6 flex flex-wrap gap-4">
              <n-button
                size="small" @click="testConsole('board', undefined)"
              >
                GetModuleMenu
              </n-button>
              <n-button
                size="small" @click="testConsole('board_menu_db', undefined)"
              >
                SetBoardMenuByDB
              </n-button>
            </div>
          </div>

          <div class="p-4 rounded-md bg-gray-400 bg-opacity-20">
            <div>掘金</div>
            <div class="mt-6 flex flex-wrap gap-4">
              <n-button
                size="small" @click="testConsole('juejin_user', undefined)"
              >
                User
              </n-button>
              <n-button
                size="small" @click="testConsole('juejin_collections', undefined)"
              >
                Collections
              </n-button>
              <n-button
                size="small" @click="testConsole('juejin_collection_detail', undefined)"
              >
                Collection Detail
              </n-button>
            </div>
          </div>
        </div>

        <div class="result-container flex-grow-0 w-[30%] min-h-full overflow-y-auto p-4 rounded-md bg-gray-400 bg-opacity-20 break-words">
          <div class="sticky top-2 mb-6 flex flex-wrap gap-4">
            <n-button
              strong
              secondary
              type="tertiary"
              size="small" @click="clearResult"
            >
              Clear
            </n-button>
          </div>
          <pre>{{ result }}</pre>
        </div>
      </div>
    </template>
  </WorldlineContent>
</template>
