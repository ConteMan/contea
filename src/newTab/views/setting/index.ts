import type { ModuleKey } from '@config/index'
import { useMessage } from 'naive-ui'
import { useTimeoutFn, watchDebounced } from '@vueuse/core'
import { ConfigModel } from '@models/index'
import { useConfigState, useNewTabState } from '@newTab/store/index'
import Board from '@services/board'

export default (module: ModuleKey, configKeys: string[]) => {
  const message = useMessage()

  const data = reactive({
    hasInit: false,
    resetLoading: false,
    initConfigLoading: '',
    model: {} as any,
    rules: {} as any,
  })
  const {
    hasInit,
    model,
    rules,
    resetLoading,
    initConfigLoading,
  } = toRefs(data)

  const ConfigStore = useConfigState()

  // 初始化，获取设置
  const init = async (module: ModuleKey) => {
    const showModel = {} as any
    const model = await ConfigModel.getItem(module)
    configKeys.forEach((key) => {
      if (model?.[key])
        showModel[key] = model[key]
    })
    data.model = showModel
  }
  void init(module)

  // 模块修改涉及的变动
  const effect = async (module: ModuleKey) => {
    await ConfigStore.setAll()

    await Board.refreshMenu(module)

    const NewTabStore = useNewTabState()
    await NewTabStore.setBoardMenuByDB()
  }

  // 保存设置
  const modelSet = async (module: ModuleKey, data: any) => {
    await ConfigModel.mergeSet(module, data)
    await effect(module)
  }

  // 重置设置
  const reset = (module: ModuleKey) => {
    data.resetLoading = true
    useTimeoutFn(async () => {
      await ConfigModel.init(module)

      await effect(module)

      await init(module)

      data.resetLoading = false
      message.success('#reset success!')
    }, 1000)
  }

  // 自动保存
  watchDebounced(model, (newValue) => {
    if (!hasInit.value) {
      hasInit.value = true
      return
    }
    void modelSet(module, toRaw(newValue))
  }, {
    deep: true,
    flush: 'post',
    debounce: 500,
  })

  // 初始化 **全局** 设置
  const initConfig = (type: 'all' | 'increase' = 'increase') => {
    data.initConfigLoading = type

    useTimeoutFn(async () => {
      await ConfigModel.init(type)
      await ConfigStore.setAll()
      await init(module)

      data.initConfigLoading = ''
      message.success('#reset-all success!')
    }, 1000)
  }

  return {
    model,
    hasInit,
    rules,
    resetLoading,
    initConfigLoading,
    message,

    modelSet,
    init,
    reset,
    initConfig,
  }
}
