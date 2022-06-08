import { defineStore } from 'pinia'

export const useModalState = defineStore('modal', {
  state: () => {
    return {
      show: false,
    }
  },
  actions: {
    change(status = false) {
      this.show = status
    },
  },
})
