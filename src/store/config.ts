import { defineStore } from 'pinia'
import _ from 'lodash-es'
import configState from '@models/keyValue/configState'
import storeState from '@models/keyValue/storeState'

export const useConfigState = defineStore('config', {
  state: () => {
    return {
      all: {} as any,
      sortList: [] as any,
    }
  },
  actions: {
    // 初始化
    async setAll() {
      this.all = await configState.storage.all()
      await this.dealSortList()
    },
    // 排序，优先按照传入排序，没有的放在最后
    async dealSortList(data: any[] = []) {
      if (data.length) {
        this.sortList = data
        return
      }

      let allList = Object.values(this.all)
      allList = allList.filter((i: any) => {
        return i?.showCard
      })
      if (!this.sortList) {
        this.sortList = allList
        return
      }

      const currentList = this.sortList
      let newList: any = []
      currentList.forEach((item: any) => {
        const index = _.findIndex(allList, (i: any) => {
          return i.key === item.key && i.enable
        })
        if (index >= 0) {
          newList.push(allList[index])
          allList.splice(index, 1)
        }
      })
      if (allList.length) {
        allList = allList.filter((i: any) => {
          return i.enable
        })
        newList = [...newList, ...allList]
      }

      this.sortList = newList
    },
  },
  persist: {
    key: 'config',
    storage: storeState,
    paths: ['sortList'], // 只存储排序列表
    overwrite: true,
  },
})
