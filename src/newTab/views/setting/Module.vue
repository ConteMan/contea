<script setup lang="ts">
import { useConfigState } from '@newTab/store/index'

interface ModuleItem {
  name: string
  title: string
  component: Component
}

const ConfitStore = useConfigState()
const { all: moduleConfigs } = ConfitStore

const showModules: ModuleItem[] = [] // 自动加载模块设置

const file: Record<string, Component> = import.meta.glob('./modules/*.vue', { import: 'default', eager: true })
const paths = Object.keys(file)
paths.forEach((path) => {
  const key = path.replace('\.\/modules\/', '').replace('.vue', '')
  const name = key.toLowerCase()
  if (moduleConfigs?.[name]) {
    showModules.push({
      name,
      title: moduleConfigs[name].name,
      component: file[path],
    })
  }
})
</script>

<template>
  <div class="max-w-full flex flex-col gap-2">
    <n-card v-for="item in showModules" :key="item.name" :title="item.title">
      <Component :is="item.component" />
    </n-card>
  </div>
</template>

<style scoped lang="less">

</style>
