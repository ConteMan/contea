import { defineStore } from 'pinia'
import { ConfigModel } from '@models/index'
import { useNewTabState } from '@newTab/store/index'

export const useModalState = defineStore('modal',
  () => {
    const data = reactive({
      show: false,
    })
    const { show } = toRefs(data)

    function change(status = false) {
      data.show = status
      if (!status)
        useNewTabState().setInit()
    }

    async function dealModal() {
      const res = await ConfigModel.getItem('BACKGROUND_SHORTCUT_SEARCH')
      if (res && res.show) {
        data.show = true
        ConfigModel.addOrUpdateItem('BACKGROUND_SHORTCUT_SEARCH', { show: false })
        return true
      }
      else {
        return false
      }
    }

    return {
      show,
      change,
      dealModal,
    }
  },
)
