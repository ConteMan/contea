import { defineStore } from 'pinia'
import { reactive } from 'vue'
import storeState from '@models/keyValue/storeState'
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
      themeMode: true, // true => system, false => manual
      theme: 'light', // light, dark

      layoutMode: 'clean', // clean, list
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
      data.wallpaper.url = url
      data.wallpaper.mode = 'local'
      data.wallpaper = { ...data.wallpaper }
    }

    function changeSettingDrawer() {
      data.settingDrawer = !data.settingDrawer
    }

    function changeSettingDrawerPosition(position: 'left' | 'right') {
      data.settingDrawerPosition = position
    }

    function setLog(data: any) {
      data.log = data
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
      const mode = useConfigState().all?.base.themeMode ?? true
      data.themeMode = mode
      if (mode)
        changeTheme(data.isPreferredDark ? 'dark' : 'light')
    }

    function changeLayoutMode() {
      data.layoutMode = data.layoutMode === 'clean' ? 'list' : 'clean'
    }

    function setLayoutMode(mode: 'clean' | 'list' | 'card') {
      data.layoutMode = mode
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
      changeIsPreferredDark,

      changeLayoutMode,
      setLayoutMode,
    }
  },
  {
    persist: {
      key: 'newTab',
      storage: storeState,
    },
  },
)
