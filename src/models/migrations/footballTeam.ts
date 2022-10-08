export interface FootballTeam {
  id?: number
  name: string
  competition_id: number
  g_id: number
  w_id: number
  [other: string]: any
}

export const footballTeam = '++id, name, competition_id, g_id, w_id'
