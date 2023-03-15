import _ from 'lodash-es'
import { defineStore } from 'pinia'
import { ConfigModel } from '@models/index'

interface DataType {
  all: any
  sortList: any[]
}

export const useConfigState = defineStore('config',
  () => {
    const data: DataType = reactive({
      all: {},
      sortList: [],
    })

    const { all, sortList } = toRefs(data)

    // 初始化
    async function setAll() {
      data.all = await ConfigModel.getAll('obj')
      // await dealSortList()
    }

    // 排序，用于模块展示
    // 优先按照传入排序，没有的放在最后
    function dealSortList(dealData: any[] = []) {
      if (dealData.length) {
        data.sortList = dealData
        return
      }

      let allList = Object.values(data.all)
      allList = allList.filter((i: any) => {
        return i?.showCard
      })
      if (!data.sortList) {
        data.sortList = allList
        return
      }

      const currentList = data.sortList
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

      data.sortList = newList
    }

    return {
      all,
      sortList,

      setAll,
      dealSortList,
    }
  },
  {
    persist: {
      key: 'config',
    },
  },
)
