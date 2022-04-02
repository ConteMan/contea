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
      settingDrawerPosition: 'right',
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
    changeSettingDrawerPosition(position: 'left' | 'right') {
      this.settingDrawerPosition = position
    },
  },
  persist: {
    key: 'newTab',
    storage: storeState,
    overwrite: true,
  },
})
