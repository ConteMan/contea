import { defineStore } from 'pinia'
import storeState from '~/models/keyValue/storeState'

export const useNewTabState = defineStore('newTab', {
  state: () => {
    return {
      tabSelected: 'worldline',
    }
  },
  actions: {
    changeTab(name: string) {
      this.tabSelected = name
    },
  },
  persist: {
    key: 'newTab',
    storage: storeState,
    overwrite: true,
  },
})
