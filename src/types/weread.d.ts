namespace Weread {
  export interface BaseUser {
    userVid: number
  }
  
  export type User = BaseUser & {
    name?: string
    gender?: number
    avatar?: string
    isHide: number
    medalInfo?: {
      id: string
      desc: string
    }
    signature?: string
    location?: string
  }
}