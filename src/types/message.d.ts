namespace Message {
  export interface BaseMessage {
    type: string
    [other: string]: any
  }
  
  export type TabMessage = BaseMessage & {
    name?: string
    data?: any
  }
  
  export type RuntimeMessage = BaseMessage
}