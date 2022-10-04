<script setup lang="ts">
import type { Component } from 'vue'
import { useConfigState } from '@newTab/store/index'

interface ModuleItem {
  name: string
  component: Component
  title?: string
  config?: Record<string, any>
}

const ConfitStore = useConfigState()
const { all: moduleConfigs } = ConfitStore

const modules: Record<string, ModuleItem> = {}
const file: Record<string, Component> = import.meta.glob('./modules/*.vue', { import: 'default', eager: true })
const paths = Object.keys(file)
paths.forEach((path) => {
  const key = path.replace('\.\/modules\/', '').replace('.vue', '')
  const name = key.toLowerCase()
  if (moduleConfigs?.[name]) {
    modules[key] = {
      name,
      title: moduleConfigs[name].name,
      config: moduleConfigs[name],
      component: file[path],
    }
  }
})

const expandedNames = ref([])
</script>

<template>
  <div class="setting-container w-full max-w-[700px] mb-4">
    <n-collapse
      v-model:expanded-names="expandedNames"
      class="max-w-full"
      accordion
    >
      <template v-for="item in modules" :key="item.name">
        <n-collapse-item :name="item.name" :title="item.title">
          <Component :is="item.component" />
        </n-collapse-item>
      </template>
    </n-collapse>
  </div>
</template>

<style scoped lang="less">
.setting-container {
  .n-collapse .n-collapse-item {
    margin: 0.5rem 0 0 0;
    background-color: rgba(209, 213, 219, 0.178);
    border-radius: 0.25rem;
    :deep(.n-collapse-item__header) {
      padding: 1rem;
    }
    :deep(.n-collapse-item__content-wrapper) {
      padding: 0 2rem 0 2rem;
    }
    :deep(.n-collapse-item__content-inner) {
      padding-top: 0;
    }
  }
}
</style>
