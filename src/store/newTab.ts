import { defineStore } from 'pinia'
import storeState from '@models/keyValue/storeState'
import wallpaperService from '@services/wallpaper'

export const useNewTabState = defineStore('newTab', {
  state: () => {
    return {
      tabSelected: 'worldline',
      wallpaper: {
        url: '',
        mode: 'random', // fixed, random
        opacity: 10,
        source: [
          'alphacoders-anime',
        ],
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
    changeWallpaperOpacity(opacity: number) {
      this.wallpaper.opacity = opacity
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
