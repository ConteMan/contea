import { defineStore } from 'pinia'

export const useModalState = defineStore('modal',
  () => {
    const data = reactive({
      show: false,
    })
    const { show } = toRefs(data)

    function change(status = false) {
      data.show = status
    }

    return {
      show,
      change,
    }
  },
)
