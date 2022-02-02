import { defineStore } from 'pinia'
import _ from 'lodash-es'
import configState from '~/models/keyValue/configState'
import storeState from '~/models/keyValue/storeState'

import { modules } from '~/setting/defaultSetting'

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
      this.all = await configState.storage.bulkSelect(modules)
      // eslint-disable-next-line no-console
      console.log('in setAll')
      await this.dealSortList()
    },
    // 排序，优先按照传入排序，没有的放在最后
    async dealSortList(data: any[] = []) {
      // eslint-disable-next-line no-console
      console.log('in dealSortList')
      if (data.length) {
        this.sortList = data
      }
      else {
        let allList = Object.values(this.all)
        // eslint-disable-next-line no-console
        console.log({ allList })
        if (!this.sortList) {
          this.sortList = allList
        }
        else {
          const currentList = this.sortList
          let newList: any = []
          currentList.forEach((item: any) => {
            const index = _.findIndex(allList, (i: any) => {
              return i.key === item.key && i.enable
            })
            if (index >= 0) {
              // eslint-disable-next-line no-console
              console.log('index', index)
              newList.push(allList[index])
              allList.splice(index, 1)
            }
          })
          // eslint-disable-next-line no-console
          console.log('in dealSortList')
          if (allList.length) {
            allList = allList.filter((i: any) => {
              return i.enable
            })
            newList = [...newList, ...allList]
          }

          // eslint-disable-next-line no-console
          console.log({ newList })
          this.sortList = newList
        }
      }
    },
  },
  persist: {
    key: 'config',
    storage: storeState,
    paths: ['sortList'], // 只存储排序列表
    overwrite: true,
  },
})
