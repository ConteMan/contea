import { defineStore } from 'pinia'
import configState from '~/models/keyValue/configState'

import { modules } from '~/setting/defaultSetting'

export const useConfigState = defineStore('config', {
  state: () => {
    return {
      all: {} as any,
    }
  },
  actions: {
    async setAll() {
      this.all = await configState.storage.bulkSelect(modules)
    },
  },
})
