<template>
  <div class="pb-2">
    <div class="mb-4 flex justify-between items-center">
      <span>
        存储
      </span>
      <div>
        <n-button strong secondary type="tertiary" size="small" @click="testFunction(Storage.managedUse())">
          获取
        </n-button>
      </div>
    </div>
    <n-log class="break-all" :hljs="hljs" language="naive-log" :log="data.log" />
  </div>
</template>

<script setup lang="ts" name="Test">
import hljs from 'highlight.js/lib/core'
import { Storage } from '~/services/browser/index'
import { isObject } from '~/utils/is'

hljs.registerLanguage('naive-log', () => ({
  contains: [
    {
      className: 'number',
      begin: /\d+/,
    },
  ],
}))

const data = reactive({
  log: '',
})

const testFunction = async(functionIns: any) => {
  const res = await functionIns
  data.log += isObject(res) ? `${JSON.stringify(res, null, 2)}\n` : `${String(res)}\n`
}
</script>
