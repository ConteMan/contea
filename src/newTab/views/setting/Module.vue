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
  <n-collapse
    class="max-w-full"
    accordion
  >
    <n-collapse-item v-for="item in showModules" :key="item.name" :name="item.name" :title="item.title">
      <Component :is="item.component" />
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="less">
.setting-tab {
  :deep(.n-tab-pane) {
    overflow: overlay;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  &::-webkit-scrollbar {
    width: 0;
  }
}
.base-pane {
  padding: var(--n-pane-padding);
  background-color: rgba(209, 213, 219, 0.178);
  border-radius: 0.25rem;
}
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
    &:last-child {
      margin-bottom: 1rem;
    }
  }
}
</style>
