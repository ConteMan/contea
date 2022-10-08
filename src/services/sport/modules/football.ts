import { FootballTeam } from '@models/index'
import RequestCache from '@services/base/requestCache'
import Gooooal from './football/gooooal'
import Netease from './football/netease'

export interface TeamItem {
  name: string
  competition_id: number // 联赛 ID
  g_id: number
  w_id: number
}
export interface CompetitionItem {
  id: number
  name: string // 联赛名称
  g: number // gooooal 联赛 ID
  w: number // 网易体育联赛 ID
}
export type CompetitionType = Record<number, CompetitionItem>
export interface CompetitionCatTypeItem {
  key: string
  name: string
}
export type CompetitionCatType = CompetitionCatTypeItem[]

class Football {
  public MODULE = 'sport'
  public MODULE_TYPE = 'football'

  // 联赛 ID 关系
  public COMPETITIONS: CompetitionType = {
    1: {
      id: 1,
      name: '英超',
      g: 4,
      w: 82,
    },
    2: {
      id: 2,
      name: '法甲',
      g: 5,
      w: 142,
    },
    3: {
      id: 3,
      name: '西甲',
      g: 2,
      w: 120,
    },
    4: {
      id: 4,
      name: '德甲',
      g: 3,
      w: 129,
    },
    5: {
      id: 5,
      name: '意甲',
      g: 1,
      w: 108,
    },
  }

  // 积分排名
  public COMPETITION_CATS: CompetitionCatType = [
    {
      key: 'rankList',
      name: '积分排名',
    },
  ]

  /**
   * 初始化
   */
  async init() {
    const competitionIds = Object.keys(this.COMPETITIONS)
    competitionIds.forEach(async (competitionId) => {
      const id = parseInt(competitionId)
      await this.saveTeams(id)
      await this.getCompetitionRank(id)
    })
    return true
  }

  /**
   * 获取联赛队伍列表
   * @param competitionId - 联赛 ID
   */
  async getTeamsByRank(competitionId = 1) {
    try {
      const relation = this.COMPETITIONS[competitionId]
      const gId = relation.g
      const wId = relation.w
      const gList = await Gooooal.getCompetitionRank({ lid: gId })
      if (!gList)
        return false
      const wList = await Netease.getCompetitionRank(wId)
      if (!wList)
        return false
      const teamList: TeamItem[] = []
      gList.forEach((item, index) => {
        teamList.push({
          competition_id: competitionId,
          name: item.team_name,
          g_id: item.team_id,
          w_id: wList[index].teamId,
        })
      })
      return teamList
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }

  /**
   * 根据联赛获取队伍列表
   * @param competitionId - 联赛 ID
   */
  async getTeams(competitionId = 1) {
    const res = await FootballTeam.query()
      .filter((item) => {
        return item.competition_id === competitionId
      })
      .toArray()
    return res ?? false
  }

  /**
   * 保存联赛队伍数据
   * @param competitionId - 联赛 ID
   */
  async saveTeams(competitionId = 1) {
    try {
      const hasData = await FootballTeam.has(competitionId, 'competition_id')
      if (hasData)
        return false
      const teams = await this.getTeamsByRank(competitionId)
      if (!teams)
        return false
      return await FootballTeam.query().bulkAdd(teams)
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('[ e ] >', e)
      return false
    }
  }

  /**
   * 获取球队信息
   * @param key - 键值
   * @param index - 索引
   */
  async getTeam(key: string | number, index: 'name' | 'g_id' | 'w_id' = 'name') {
    return FootballTeam.getItem(key, index)
  }

  /**
   * 获取联赛排行信息
   * @param competitionId - 联赛 ID
   * @param refresh - 刷新
   */
  async getCompetitionRank(competitionId = 1, refresh = false) {
    try {
      const cacheKey = [this.MODULE, this.MODULE_TYPE, 'CompetitionRank', competitionId]

      if (!refresh) {
        const cacheData = await RequestCache.get(cacheKey)
        if (cacheData)
          return cacheData
      }

      const lid = this.COMPETITIONS[competitionId].g
      const list = await Gooooal.getCompetitionRank({ lid })
      if (!list)
        return false
      list.map(async (item) => {
        const teamInfo = await this.getTeam(item.team_id, 'g_id')
        item.team_id = teamInfo.id
        return item
      })

      return await RequestCache.set(cacheKey, { data: list }, undefined, -1)
    }
    catch (e) {
      return false
    }
  }
}

export default new Football()
