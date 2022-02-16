<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    size="small"
    label-placement="left"
    label-width="auto"
    label-align="left"
  >
    <n-form-item label="开启" path="enable">
      <n-switch v-model:value="model.enable" size="small" :round="false" />
    </n-form-item>
    <n-form-item label="卡片" path="showCard">
      <n-switch v-model:value="model.showCard" size="small" :round="false" />
    </n-form-item>
    <n-form-item label="定时" path="alarm">
      <n-input-number v-model:value="model.alarm">
        <template #suffix>
          分钟
        </template>
      </n-input-number>
    </n-form-item>
    <n-form-item label="过期" path="expried">
      <n-input-number v-model:value="model.expried">
        <template #suffix>
          分钟
        </template>
      </n-input-number>
    </n-form-item>
    <n-form-item label="重置">
      <n-switch v-model:value="resetLoading" :loading="resetLoading" size="small" :round="false" @update:value="reset()" />
    </n-form-item>
  </n-form>
</template>
<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import type { ShowConfig } from '~/services/wakatime/model'

import ConfigState from '~/models/keyValue/configState'

const message = useMessage()

const module = 'wakatime'

const data = reactive({
  hasInit: false,
  resetLoading: false,
  model: {} as ShowConfig,
  rules: {} as any,
})
const { hasInit, resetLoading, model, rules } = toRefs(data)

const init = async() => {
  data.hasInit = false
  await nextTick()
  data.model = await ConfigState.getItem(module)
  await nextTick()
  data.hasInit = true
}
init()

// 进行设置
const modelSet = async() => {
  // eslint-disable-next-line no-console
  console.log('[mergeset] > ', true)
  await ConfigState.mergeSet(module, model.value)
}

// 重置
const reset = async() => {
  data.resetLoading = true
  useTimeoutFn(async() => {
    await ConfigState.init(module)
    init()
    data.resetLoading = false
    message.success('Success!')
  }, 1000)
}

watch(model, async() => {
  if (hasInit.value)
    await modelSet()
},
{ deep: true })
</script>
