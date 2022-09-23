namespace Message {
  export interface BaseMessage {
    type: string
    [other: string]: string
  }
  
  export type TabMessage = BaseMessage & {
    name?: string
    data?: any
  }
  
  export type RuntimeMessage = BaseMessage
}