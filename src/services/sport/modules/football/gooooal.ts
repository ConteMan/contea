import DomDeal from '@services/base/dom'

interface RankParams {
  lid: number
  sid?: number
}

interface RankItem {
  sort: number
  trend: string
  trend_des: string
  team_name: string
  team_id: number
  points: number
  games: number
  win: number
  draw: number
  loss: number
  goal: number
  loss_goal: number
  diff_goal: number
  recent_result: string[]
  recent_des: string
  next_match_team_name: string
}

export default new class Gooooal {
  private URL = 'http://app.gooooal.com'
  private PAGE_TYPES = [
    'CompetitionRank',
  ]

  /**
   * 格式化页面
   * @param type - 类型
   * @param pageData - 页面字符串
   */
  formatPage(type: string, pageData: string) {
    if (!this.PAGE_TYPES.includes(type))
      return false

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(pageData, 'text/html')

    if (type === 'CompetitionRank')
      return this.formatCompetitionRank(dom)
    return false
  }

  /**
   * 格式化联赛排名信息
   * @param dom - DOM 数据
   */
  formatCompetitionRank(dom: Document) {
    try {
      const items = dom.querySelectorAll('#tb_data_1 tr')
      const rankList: RankItem[] = []
      items.forEach((item, index) => {
        if (index > 0) {
          const detail = item.querySelectorAll('td')

          const sort_str = typeof detail[0].querySelector('span')?.innerText === 'string' ? detail[0].querySelector('span')?.innerText.trim() : ''
          const sort = sort_str ? parseInt(sort_str) : 0
          const trend_img_url = detail[1].querySelector('a img')?.getAttribute('src')
          let trend = ''
          if (trend_img_url) {
            if (/.*intrIconA01\.png/.test(trend_img_url))
              trend = 'up'
            if (/.*intrIconA02\.png/.test(trend_img_url))
              trend = 'down'
            if (/.*intrIconA03\.png/.test(trend_img_url))
              trend = 'no-change'
          }
          let trend_des = ''
          const trend_des_detail = detail[1].querySelectorAll('div ul li')
          trend_des_detail.forEach((tItem, tIndex) => {
            const str = tItem.innerHTML ? tItem.innerHTML.trim().replaceAll(/\<em.*?\>|\<\/em\>|\t|\n/g, '') : ''
            if (tIndex > 0 && trend_des)
              trend_des += '，'
            trend_des += str
          })
          const team_name = detail[2].querySelector('a')?.innerText.trim() ?? ''
          const team_id_str = detail[2].querySelector('a')?.getAttribute('href')
          const team_id = team_id_str ? parseInt(team_id_str.replaceAll(/javascript\:toTeam\(|\)/g, '').split(',')[0]) : 0
          const points = detail[3].innerText ? parseInt(detail[3].innerText) : 0
          const games = detail[4].innerText ? parseInt(detail[4].innerText) : 0
          const win = detail[5].innerText ? parseInt(detail[5].innerText) : 0
          const draw = detail[6].innerText ? parseInt(detail[6].innerText) : 0
          const loss = detail[7].innerText ? parseInt(detail[7].innerText) : 0
          const goal = detail[8].innerText ? parseInt(detail[8].innerText) : 0
          const loss_goal = detail[9].innerText ? parseInt(detail[9].innerText) : 0
          const diff_goal = detail[10].innerText ? parseInt(detail[10].innerText) : 0
          const recent_result_detail = detail[11].querySelectorAll('span')
          const recent_result: string[] = []
          recent_result_detail.forEach((rItem) => {
            const rItemClass = rItem.getAttribute('class')
            if (!rItemClass)
              return
            if (/ico_lwd\sico_d/.test(rItemClass))
              recent_result.push('draw')
            else if (/ico_lwd\sico_w/.test(rItemClass))
              recent_result.push('win')
            else
              recent_result.push('loss')
          })
          const recent_des = detail[12].innerText.trim()
          const next_match_team_name = detail[13].querySelector('span img')?.getAttribute('title')?.trim() ?? ''

          rankList.push({
            sort,
            trend,
            trend_des,
            team_name,
            team_id,
            points,
            games,
            win,
            draw,
            loss,
            goal,
            loss_goal,
            diff_goal,
            recent_result,
            recent_des,
            next_match_team_name,
          })
        }
      })
      return rankList
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }

  /**
   * 获取联赛排名信息
   * @param params - 请求参数
   */
  async getCompetitionRank(params: RankParams) {
    try {
      const { lid = 0 } = params
      if (!lid)
        return false

      let sid = params?.sid
      if (!sid)
        sid = new Date().getFullYear()

      const pageUrl = `${this.URL}/competition.do?lid=${lid}&sid=${sid}&lang=cn`
      const pageData = await DomDeal.getPage(pageUrl)
      if (!pageData)
        return false

      return this.formatPage('CompetitionRank', pageData)
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }
}()
