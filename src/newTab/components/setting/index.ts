import type { SettingKeys } from '@setting/index'
import { useMessage } from 'naive-ui'
import { useTimeoutFn } from '@vueuse/core'
import ConfigState from '@models/keyValue/configState'
import { useConfigState } from '@newTab/store/config'

export default (module: SettingKeys, configKeys: string[]) => {
  const message = useMessage()

  const data = reactive({
    hasInit: false,
    resetLoading: false,
    initConfigLoading: false,
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

  const ConfigStateStore = useConfigState()

  // 保存设置
  const modelSet = async(module: SettingKeys, data: any) => {
    await ConfigState.mergeSet(module, data)
    await ConfigStateStore.setAll()
    message.success('Model Set Success!')
  }

  // 初始化
  const init = async(module: SettingKeys) => {
    const showModel = {} as any
    const model = await ConfigState.getItem(module)
    configKeys.forEach((key) => {
      if (model[key])
        showModel[key] = model[key]
    })
    // eslint-disable-next-line no-console
    console.log('showModel >', showModel)
    data.model = showModel
    await nextTick()
    data.hasInit = true
  }

  // 重置模块设置
  const reset = async(module: SettingKeys) => {
    data.resetLoading = true
    useTimeoutFn(async() => {
      await ConfigState.init(module)
      data.resetLoading = false
      message.success('Reset Success!')
    }, 1000)
  }

  // 初始化扩展设置
  const initConfig = async() => {
    data.initConfigLoading = true

    useTimeoutFn(async() => {
      await ConfigState.init('all')
      data.initConfigLoading = false
      message.success('Init Success!')
    }, 1000)
  }

  init(module)

  // 自动保存
  watch(model, (newValue) => {
    if (hasInit.value) {
      // eslint-disable-next-line no-console
      console.log('model >', toRaw(newValue))
      modelSet(module, toRaw(newValue))
    }
  }, {
    deep: true,
    flush: 'post',
  })

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
