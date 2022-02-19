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

    <n-form-item label="重置">
      <n-switch
        v-model:value="resetLoading"
        :loading="resetLoading"
        :round="false"
        size="small"
        @update:value="reset()"
      />
    </n-form-item>
  </n-form>
</template>
<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useMessage } from 'naive-ui'

import ConfigState from '~/models/keyValue/configState'

import type { ShowConfig } from '~/services/sport/model'
const module = 'sport'

const message = useMessage()

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
