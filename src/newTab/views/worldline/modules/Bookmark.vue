<script setup lang="ts">
import { Bookmark as BaseService } from '@services/browser'
import WorldlineContent from '@newTab/layout/WorldlineContent.vue'

interface TreeOption {
  id: number
  title: string
  children?: TreeOption
  url?: string
}

interface Data {
  loading: boolean
  tree: any[]
  pattern: string
  showIrrelevantNodes: boolean

  detail: TreeOption
}

const data: Data = reactive({
  loading: true,
  tree: [],
  pattern: '',
  showIrrelevantNodes: false,

  detail: {
    id: 0,
    title: '',
  },
})
const { loading, tree, pattern, showIrrelevantNodes, detail } = toRefs(data)

// 获取展示数据
const getData = async () => {
  const res = await BaseService.tree()
  if (res)
    data.tree = res
  data.loading = false
}

// 初始化
const init = async () => {
  await getData()
}
init()

// 刷新数据
const refresh = async () => {
  data.loading = true
  await getData()
  data.loading = false
}

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      detail.value = option
    },
  }
}
</script>

<template>
  <WorldlineContent>
    <template #bar>
      <a class="cursor-pointer py-2 px-4 flex items-center" @click="refresh()">
        <mdi-refresh :class="{ 'animate-spin': loading }" />
      </a>
    </template>

    <template #content>
      <div class="h-full w-full pr-8 pb-8">
        <input v-model="pattern" placeholder="Search" class="w-full p-4 bg-[#9d9d9d47] placeholder-white text-white text-[14px] rounded-sm">
        <div class="h-full py-4 flex gap-4">
          <div v-if="tree.length" class="bookmark-tree flex-grow-0 flex-shrink-0 h-full w-[50%] overflow-y-auto hover-scroll">
            <n-tree
              block-line
              :data="tree"
              :pattern="pattern"
              :show-irrelevant-nodes="showIrrelevantNodes"
              :node-props="nodeProps"
              key-field="id"
              label-field="title"
              children-field="children"
            />
          </div>
          <div v-if="detail.id && !detail.children" class="bookmark-detail flex-grow-0 flex-shrink-0 w-[50%] h-full overflow-y-auto hover-scroll flex flex-col p-4 gap-6">
            <div class="flex flex-col gap-2">
              <p>{{ detail.title ?? detail.url }}</p>
              <a :href="detail.url" class="text-blue-400">{{ detail.url }}</a>
            </div>
            <pre v-html="JSON.stringify(detail, null, 2)" />
          </div>
        </div>
      </div>
    </template>
  </WorldlineContent>
</template>

<style scoped>
:focus-visible {
  outline: none;
}
:deep(.n-tree .n-tree-node.n-tree-node--highlight .n-tree-node-content .n-tree-node-content__text) {
  border-bottom: none;
}
</style>
