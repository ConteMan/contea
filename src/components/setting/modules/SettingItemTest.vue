<template>
  <div class="pb-2">
    <div class="mb-4 flex justify-between items-center">
      <span>存储</span>
      <div>
        <n-button strong secondary type="tertiary" size="small" @click="testFunction(Storage.managedUse())">
          获取
        </n-button>
      </div>
    </div>

    <div class="mb-4 flex justify-between items-center">
      <span>直播</span>
      <div>
        <n-button strong secondary type="tertiary" size="small" @click="testFunction(Live.following(true))">
          虎牙订阅
        </n-button>
      </div>
    </div>

    <div class="mb-4 flex justify-between items-center">
      <span>后台操作</span>
      <div class="space-x-1">
        <n-button strong secondary type="tertiary" size="small" @click="testFunction(backgroundCommand({ command: 'exec-content-script', data: {} }))">
          执行脚本
        </n-button>
      </div>
    </div>

    <n-log class="break-all" :hljs="hljs" language="naive-log" :log="data.log" />
  </div>
</template>

<script setup lang="ts" name="Test">
import hljs from 'highlight.js/lib/core'
import { isObject } from '@utils/is'
import { Storage } from '@services/browser/index'
import Live from '@services/live'

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

const backgroundCommand = async(message: any) => {
  const extensionId = browser.runtime.id
  const res = await browser.runtime.sendMessage(extensionId, message)
  // eslint-disable-next-line no-console
  console.log('[backgroundCommand] >', res)
  return res
}
</script>
