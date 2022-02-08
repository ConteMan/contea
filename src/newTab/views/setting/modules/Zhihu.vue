<template>
  <SettingItem>
    <template #left>
      <div class="ml-4 min-w-24">
        开启
      </div>
    </template>
    <template #right>
      <n-switch v-model:value="base.enable" size="small" :round="false" @update:value="actionSet('enable', base.enable)" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        卡片
      </div>
    </template>
    <template #right>
      <n-switch v-model:value="base.showCard" size="small" :round="false" @update:value="actionSet('showCard', base.showCard)" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        重置
      </div>
    </template>
    <template #right>
      <n-switch v-model:value="resetLoading" :loading="resetLoading" size="small" :round="false" @update:value="reset()" />
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import type { ShowConfig } from '~/services/zhihu/model'

import SettingItem from '~/components/template/SettingItem.vue'
import ConfigState from '~/models/keyValue/configState'

const message = useMessage()

const module = 'zhihu'

const data = reactive({
  base: {} as ShowConfig,
  resetLoading: false,
})
const { base, resetLoading } = toRefs(data)

ConfigState.data[`${module}$`](
  (value: any) => {
    data.base = value
  },
  { immediate: true },
)

// 进行设置
const actionSet = async(keyName: string, data?: any) => {
  await ConfigState.mergeSet(module, { [keyName]: toRaw(data) })
}

// 重置
const reset = async() => {
  data.resetLoading = true
  useTimeoutFn(async() => {
    await ConfigState.init(module)
    data.resetLoading = false
    message.success('Success!')
  }, 1000)
}
</script>
