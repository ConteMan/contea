import { defineStore } from 'pinia'
import storeState from '@models/keyValue/storeState'
import wallpaperService from '@services/wallpaper'
import { useConfigState } from '@store/config'

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

      log: '',
      showLogWindow: false,

      isPreferredDark: false,
      themeMode: true, // true => system, false => manual
      theme: 'light', // light, dark
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
    setLog(data: any) {
      this.log = data
    },
    changeLogWindow() {
      this.showLogWindow = !this.showLogWindow
    },

    // 主题
    changeIsPreferredDark(status: boolean) {
      this.isPreferredDark = status
      if (this.themeMode)
        this.changeTheme(status ? 'dark' : 'light')
    },
    setThemeMode() {
      const mode = useConfigState().all?.base.themeMode ?? true
      this.themeMode = mode
      if (mode)
        this.changeTheme(this.isPreferredDark ? 'dark' : 'light')
    },
    changeTheme(theme: 'light' | 'dark') {
      this.theme = theme
    },
  },
  persist: {
    key: 'newTab',
    storage: storeState,
    overwrite: true,
  },
})
