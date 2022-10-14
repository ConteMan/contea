import type { SettingKeys } from '@setting/index'
import { useMessage } from 'naive-ui'
import { useTimeoutFn, watchDebounced } from '@vueuse/core'
import { ConfigModel } from '@models/index'
import { useConfigState } from '@newTab/store/index'

export default (module: SettingKeys, configKeys: string[]) => {
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
  const init = async (module: SettingKeys) => {
    const showModel = {} as any
    const model = await ConfigModel.getItem(module)
    configKeys.forEach((key) => {
      if (model?.[key])
        showModel[key] = model[key]
    })
    data.model = showModel
  }
  init(module)

  // 保存设置
  const modelSet = async (module: SettingKeys, data: any) => {
    await ConfigModel.mergeSet(module, data)
    await ConfigStore.setAll()
  }

  // 重置设置
  const reset = async (module: SettingKeys) => {
    data.resetLoading = true
    useTimeoutFn(async () => {
      await ConfigModel.init(module)
      await ConfigStore.setAll()
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
    modelSet(module, toRaw(newValue))
  }, {
    deep: true,
    flush: 'post',
    debounce: 500,
  })

  // 初始化 **全局** 设置
  const initConfig = async (type: 'all' | 'increase' = 'increase') => {
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
