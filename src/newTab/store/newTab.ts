import { defineStore } from 'pinia'
import { reactive } from 'vue'
import wallpaperService from '@services/wallpaper'
import { useConfigState } from '@newTab/store/config'

export const useNewTabState = defineStore('newTab',
  () => {
    const data = reactive({
      wallpaper: {
        url: '',
        mode: 'random', // fixed, random, local
        opacity: 10,
        source: [
          'alphacoders-anime',
        ],
      },
      settingDrawer: false,
      settingDrawerPosition: 'right',

      log: 'start log ...',
      showLogWindow: false,

      isPreferredDark: false,
      themeMode: false, // true => system, false => manual
      theme: 'light', // light, dark

      layoutMode: 'clean', // clean, list, card
    })

    const {
      wallpaper,
      settingDrawer,
      settingDrawerPosition,
      log,
      showLogWindow,
      isPreferredDark,
      theme,
      themeMode,
      layoutMode,
    } = toRefs(data)

    const tabSelected = ref('worldline')
    function changeTab(name: string) {
      tabSelected.value = name
    }

    async function changeWallpaper() {
      const info = await wallpaperService.random(data.wallpaper.source)
      if (info.url) {
        data.wallpaper.url = info.url
        data.wallpaper = { ...data.wallpaper }
      }
    }

    function changeWallpaperMode() {
      data.wallpaper.mode = data.wallpaper.mode === 'fixed' ? 'random' : 'fixed'
      data.wallpaper = { ...data.wallpaper }
    }

    function changeWallpaperOpacity(opacity: number) {
      data.wallpaper.opacity = opacity
      data.wallpaper = { ...data.wallpaper }
    }

    function setLocalWallpaper(url: string) {
      data.wallpaper = { ...data.wallpaper, url, mode: 'local' }
    }

    function changeSettingDrawer() {
      data.settingDrawer = !data.settingDrawer
    }

    function changeSettingDrawerPosition(position: 'left' | 'right') {
      data.settingDrawerPosition = position
    }

    function setLog(log: any) {
      data.log = log
    }

    function changeLogWindow() {
      data.showLogWindow = !data.showLogWindow
    }

    // 主题
    function changeTheme(theme: 'light' | 'dark') {
      data.theme = theme
    }

    function changeIsPreferredDark(status: boolean) {
      data.isPreferredDark = status
      if (data.themeMode)
        changeTheme(status ? 'dark' : 'light')
    }

    function setThemeMode() {
      const mode = useConfigState().all.base.themeMode
      data.themeMode = mode
      if (mode)
        changeTheme(data.isPreferredDark ? 'dark' : 'light')
    }

    function changeLayoutMode() {
      if (data.layoutMode === 'clean')
        data.layoutMode = 'list'
      else if (data.layoutMode === 'list')
        data.layoutMode = 'card'
      else
        data.layoutMode = 'clean'
    }

    function setLayoutMode(mode: 'clean' | 'list' | 'card') {
      data.layoutMode = mode
    }

    const getDarkClass = () => {
      if (data.theme === 'dark') {
        document.querySelector('html')?.setAttribute('class', 'dark')
        return true
      }
      else {
        document.querySelector('html')?.removeAttribute('class')
        return false
      }
    }

    return {
      tabSelected,

      wallpaper,
      settingDrawer,
      settingDrawerPosition,
      log,
      showLogWindow,
      isPreferredDark,
      theme,
      themeMode,
      layoutMode,
      getDarkClass,

      changeTab,

      changeWallpaper,
      changeWallpaperMode,
      changeWallpaperOpacity,
      setLocalWallpaper,

      changeSettingDrawer,
      changeSettingDrawerPosition,

      setLog,
      changeLogWindow,

      setThemeMode,
      changeTheme,
      changeIsPreferredDark,

      changeLayoutMode,
      setLayoutMode,
    }
  },
  {
    persist: {
      key: 'newTabStore',
      paths: undefined,
    },
  },
)
