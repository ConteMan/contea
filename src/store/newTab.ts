import { defineStore } from 'pinia'
import storeState from '~/models/keyValue/storeState'
import wallpaperService from '~/services/wallpaper'

export const useNewTabState = defineStore('newTab', {
  state: () => {
    return {
      tabSelected: 'worldline',
      wallpaper: {
        url: '',
        mode: 'random', // fixed, random
        opacity: 10,
        source: [],
      },
      settingDrawer: false,
    }
  },
  actions: {
    changeTab(name: string) {
      this.tabSelected = name
    },
    async changeWallpaper() {
      const info = await wallpaperService.random(this.wallpaper.source)
      if (info.commonImgUrl) {
        this.wallpaper.url = info.commonImgUrl
        this.wallpaper = { ...this.wallpaper }
      }
    },
    changeWallpaperMode() {
      this.wallpaper.mode = this.wallpaper.mode === 'fixed' ? 'random' : 'fixed'
    },
    changeWallpaperOpcity(opcity: number) {
      this.wallpaper.opacity = opcity
      this.wallpaper = { ...this.wallpaper }
    },
    changeSettingDrawer() {
      this.settingDrawer = !this.settingDrawer
    },
  },
  persist: {
    key: 'newTab',
    storage: storeState,
    overwrite: true,
  },
})
