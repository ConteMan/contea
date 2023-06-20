<script setup lang="ts">
import type { ModuleKey } from '@config/index'
import { useConfigState, useNewTabState } from '@newTab/store/index'
import Board from '@services/board'

const init = ref(0)
const configModel: Ref<Record<string, any>> = ref({})
const configShow: Ref<{ name: string; key: string }[]> = ref([])
const configShowModule: Ref<Board.FilterModule[]> = ref([])

const getConfig = async () => {
  const { menus: configAll, modules } = await Board.getModuleMenu(-1, true) as Board.MenuWithModule
  if (!configAll)
    return false

  // eslint-disable-next-line no-console
  console.log('[ menus ] >', configAll)

  configShowModule.value = modules

  configAll.forEach((item) => {
    configShow.value = [...configShow.value, { name: item.name, key: `${item.module}_${item.key}` }]
    configModel.value = { ...configModel.value, ...{ [`${item.module}_${item.key}`]: item.enable } }
  })

  init.value = 1
}
getConfig()

const newConfigModel = computed(() => {
  return JSON.parse(JSON.stringify(configModel.value))
})

// 收集对象差异
const diff = (n: Record<string, any>, o: Record<string, any>) => {
  const res: { module: ModuleKey; key: string; value: any }[] = []
  for (const key in n) {
    if (n[key] !== o[key]) {
      const moduleKey = key.split('_')
      const module = moduleKey[0] as ModuleKey
      const keyName = moduleKey[1]
      const value = n[key]
      res.push({ module, key: keyName, value })
    }
  }
  return res
}

// 根据对象差异，更新配置
const ConfigStore = useConfigState()
const NewTabStore = useNewTabState()
const updateConfig = async (data: { module: ModuleKey; key: string; value: any }[]) => {
  for (const item of data) {
    await Board.setModuleMenu(item.module, item.key, { enable: item.value })
    await Board.refreshMenu(item.module)
  }
}

// 自动保存
watchDebounced(() => newConfigModel.value, async (newValue, oldValue) => {
  if (init.value < 2) {
    init.value++
    return
  }

  const diffValue = diff(newValue, oldValue)
  if (diffValue.length) {
    await updateConfig(diffValue)
    await NewTabStore.setBoardMenuByDB()
    await ConfigStore.setAll()
  }
}, {
  deep: true,
  flush: 'post',
  debounce: 100,
})
</script>

<template>
  <n-form
    :model="configModel"
    size="small"
    label-placement="left"
    label-width="auto"
    label-align="left"
  >
    <div class="max-w-full flex flex-col gap-2">
      <n-card v-for="moduleItem in configShowModule" :key="moduleItem.key" :title="moduleItem.name">
        <n-form-item v-for="menuItem in moduleItem.menus" :key="menuItem.key" :label="menuItem.name">
          <n-switch v-model:value="configModel[`${menuItem.module}_${menuItem.key}`]" size="small" :round="false" />
        </n-form-item>
      </n-card>
    </div>
  </n-form>
</template>

<style scoped>

</style>
