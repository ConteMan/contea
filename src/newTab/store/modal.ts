import { defineStore } from 'pinia'
import { ConfigModel } from '@models/index'

export const useModalState = defineStore('modal',
  () => {
    const data = reactive({
      show: false,
    })
    const { show } = toRefs(data)

    function change(status = false) {
      data.show = status
    }

    async function dealModal() {
      const res = await ConfigModel.getItem('BACKGROUND_SHORTCUT_SEARCH')
      if (res.show)
        data.show = true
      ConfigModel.addOrUpdateItem('BACKGROUND_SHORTCUT_SEARCH', { show: false })
    }

    return {
      show,
      change,
      dealModal,
    }
  },
)
