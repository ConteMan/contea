<script setup lang="ts">
import { ConfigModel } from '@models/index'
import { useConfigState } from '@newTab/store/index'
import type { ModuleKey } from '~/config/index'

const init = ref(0)
const configShow: Ref<Record<string, any>> = ref({})
const moduleShow: Ref<{ name: string; key: string }[]> = ref([])

const relations: Record<string, { name: string; key: string }[]> = {
  base: [
    { name: '卡片', key: 'dashboardPage' },
    { name: '书签', key: 'moduleBookmark' },
    { name: '扩展', key: 'moduleExtension' },
    { name: '定时', key: 'statusList' },
    { name: '测试', key: 'testPage' },
  ],
}

const getConfig = async () => {
  const configAll = await ConfigModel.getAll('obj') as Record<string, any>
  if (!configAll)
    return false

  Object.keys(relations).forEach((key: string) => {
    relations[key].forEach((item) => {
      moduleShow.value = [...moduleShow.value, { name: item.name, key: `${key}_${item.key}` }]
      configShow.value = { ...configShow.value, ...{ [`${key}_${item.key}`]: configAll?.[key]?.[item.key] } }
    })
  })

  Object.keys(configAll).forEach((key: string) => {
    if (key === 'base')
      return
    moduleShow.value = [...moduleShow.value, { name: configAll[key].name, key: `${key}_boardEnable` }]
    configShow.value = { ...configShow.value, ...{ [`${key}_boardEnable`]: configAll[key].boardEnable ?? false } }
  })

  init.value = 1
}
getConfig()

const newConfigShow = computed(() => {
  return JSON.parse(JSON.stringify(configShow.value))
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
const updateConfig = async (data: { module: ModuleKey; key: string; value: any }[]) => {
  data.map(async (item) => {
    await ConfigModel.mergeSet(item.module, { [item.key]: item.value })
  })
  await ConfigStore.setAll()
}

// 自动保存
watchDebounced(() => newConfigShow.value, (newValue, oldValue) => {
  if (init.value < 2) {
    init.value++
    return
  }

  const diffValue = diff(newValue, oldValue)
  if (diffValue.length)
    updateConfig(diffValue)
}, {
  deep: true,
  flush: 'post',
  debounce: 500,
})
</script>

<template>
  <n-form
    ref="formRef"
    :model="configShow"
    size="small"
    label-placement="left"
    label-width="auto"
    label-align="left"
  >
    <n-form-item v-for="moduleItem in moduleShow" :key="moduleItem.key" :label="moduleItem.name">
      <n-switch v-model:value="configShow[moduleItem.key]" size="small" :round="false">
        <template #checked>
          展示
        </template>
        <template #unchecked>
          隐藏
        </template>
      </n-switch>
    </n-form-item>
  </n-form>
</template>

<style scoped>

</style>
