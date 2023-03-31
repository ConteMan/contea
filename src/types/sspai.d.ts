namespace Sspai {
  export interface User {
    updatedAt?: number
    expired?: number
  
    [propName: string]: any
  }
  
  export interface Paginate {
    limit: number
    offset: number
  }
}
