<script setup lang="ts">
import { useConfigState } from '@newTab/store/index'

interface ModuleItem {
  name: string
  component: string
  title?: string
  config?: Record<string, any>
}

const ConfitStore = useConfigState()
const { all: moduleConfigs } = ConfitStore

let baseModule: ModuleItem
const modules: Record<string, ModuleItem> = {}

const file: Record<string, string> = import.meta.glob('./modules/*.vue', { import: 'default', eager: true })
const paths = Object.keys(file)
paths.forEach((path) => {
  const key = path.replace('\.\/modules\/', '').replace('.vue', '')
  const name = key.toLowerCase()
  if (moduleConfigs?.[name]) {
    if (name === 'base') {
      baseModule = {
        name,
        title: moduleConfigs[name].name,
        config: moduleConfigs[name],
        component: file[path],
      }
    }
    else {
      modules[key] = {
        name,
        title: moduleConfigs[name].name,
        config: moduleConfigs[name],
        component: file[path],
      }
    }
  }
})

const expandedNames = ref([])
</script>

<template>
  <div class="setting-container max-w-[700px]">
    <n-tabs class="setting-tab h-full" type="line" default-value="base">
      <n-tab-pane name="base" tab="基础">
        <div class="base-pane !px-[1rem] mt-[0.5rem] mb-[1rem]">
          <Component :is="baseModule.component" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="module" tab="模块">
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
      </n-tab-pane>
    </n-tabs>
  </div>
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
