import { defineStore } from 'pinia'
import _ from 'lodash-es'
import { reactive } from 'vue'
import type { Ref } from 'vue'
import type { DashboardLayout, DashboardLayoutItem } from '@localTypes/newTab'
import wallpaperService from '@services/wallpaper'
import { useConfigState } from '@newTab/store/index'
import Board from '@services/board'

type LayoutMode = 'clean' | 'list' | 'card'

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

      worldlineMenu: [] as Store.MenuItem[],
      worldlineDashboardLayout: {} as DashboardLayout,
      worldlineModules: [] as string[],

      boardMenu: [] as Module.BoardMenu[],

      hasInit: false,
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
      worldlineMenu,
      worldlineDashboardLayout,
      worldlineModules,
      hasInit,
      boardMenu,
    } = toRefs(data)

    const layoutMode = ref('clean') as Ref<LayoutMode>

    // Tab
    const tabSelected = ref('')

    function changeTab(name: string) {
      tabSelected.value = name
    }

    // Menu Keys
    const dealMenuKeys = ref([] as string[])

    function setDealMenuKeys(data: string[]) {
      dealMenuKeys.value = data
    }

    // 切换下一个 Tab
    function changeNextTab() {
      const keyArr = dealMenuKeys.value
      const length = keyArr.length

      if (!length)
        return false

      const currentTab = tabSelected.value
      const index = _.findIndex(keyArr, (item) => {
        return item === currentTab
      })
      if (index < length - 1)
        changeTab(keyArr[index + 1])
      else
        changeTab(keyArr[0])
    }

    // 切换上一个 Tab
    function changePreTab() {
      const keyArr = dealMenuKeys.value
      const length = keyArr.length

      if (!length)
        return false

      const currentTab = tabSelected.value
      const index = _.findIndex(keyArr, (item) => {
        return item === currentTab
      })
      if (index > 0)
        changeTab(keyArr[index - 1])
      else
        changeTab(keyArr[length - 1])
    }

    // 背景
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

    // 「设置」抽屉
    function changeSettingDrawer() {
      data.settingDrawer = !data.settingDrawer
    }

    function changeSettingDrawerPosition(position: 'left' | 'right') {
      data.settingDrawerPosition = position
    }

    // 日志
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

    // 布局
    function changeLayoutMode() {
      if (layoutMode.value === 'clean')
        layoutMode.value = 'list'
      // else if (layoutMode.value === 'list')
      //   layoutMode.value = 'card'
      else
        layoutMode.value = 'clean'
    }

    function setLayoutMode(mode: LayoutMode) {
      layoutMode.value = mode
    }

    // Worldline Menu
    const getWorldlineMenu = () => {
      return data.worldlineMenu
    }

    const setWorldlineMenu = (menu: Store.MenuItem[]) => {
      data.worldlineMenu = menu
    }

    const getWorldlineDashboardLayout = () => {
      return data.worldlineDashboardLayout
    }

    const getWorldlineDashboardLayoutItem = (key: string) => {
      return data.worldlineDashboardLayout?.[key]
    }

    const setWorldlineDashboardLayout = (info: DashboardLayout) => {
      data.worldlineDashboardLayout = info
    }

    const setWorldlineDashboardLayoutItem = (key: string, cData: DashboardLayoutItem | undefined) => {
      if (typeof cData === 'undefined') {
        if (data.worldlineDashboardLayout?.[key])
          delete data.worldlineDashboardLayout?.[key]
        return
      }

      if (data.worldlineDashboardLayout?.[key])
        data.worldlineDashboardLayout[key] = cData

      else
        data.worldlineDashboardLayout = { ...data.worldlineDashboardLayout, [key]: cData }
    }

    const setWorldlineModules = (modules: string[]) => {
      data.worldlineModules = modules
    }
    const addWorldlineModules = (name: string) => {
      data.worldlineModules.push(name)
    }

    const deleteWorldlineModules = (name: string) => {
      _.remove(data.worldlineModules, name)
    }

    const getBoardMenu = () => {
      return data.boardMenu
    }
    const setBoardMenu = async (menu: Module.BoardMenu[]) => {
      await Board.setMenu(menu)
      data.boardMenu = menu
    }

    const setBoardMenuByDB = async () => {
      const menu = await Board.getMenu()
      data.boardMenu = menu
    }

    // init
    const setInit = () => {
      data.hasInit = true
    }

    return {
      tabSelected,
      dealMenuKeys,

      wallpaper,
      settingDrawer,
      settingDrawerPosition,
      log,
      showLogWindow,
      isPreferredDark,
      theme,
      themeMode,
      layoutMode,

      worldlineMenu,
      worldlineDashboardLayout,
      worldlineModules,

      boardMenu,

      hasInit, // 临时标识，不持久化

      setDealMenuKeys,
      changeTab,
      changeNextTab,
      changePreTab,

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
      getDarkClass,

      changeLayoutMode,
      setLayoutMode,

      getWorldlineMenu,
      setWorldlineMenu,
      getWorldlineDashboardLayout,
      setWorldlineDashboardLayout,
      getWorldlineDashboardLayoutItem,
      setWorldlineDashboardLayoutItem,

      setWorldlineModules,
      addWorldlineModules,
      deleteWorldlineModules,

      getBoardMenu,
      setBoardMenu,
      setBoardMenuByDB,

      setInit,
    }
  },
  {
    persist: {
      key: 'newTabStore',
      paths: [ // 指定持久化的内容
        'tabSelected',
        'dealMenuKeys',

        'wallpaper',
        'settingDrawer',
        'settingDrawerPosition',
        'log',
        'showLogWindow',
        'isPreferredDark',
        'theme',
        'themeMode',
        'layoutMode',

        'worldlineMenu',
        'worldlineDashboardLayout',
        'worldlineModules',

        'boardMenu',
      ],
    },
  },
)
