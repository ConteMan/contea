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
    <n-form-item label="初始化" path="enable">
      <n-switch v-model:value="initLoading" :loading="initLoading" size="small" :round="false" @update:value="reset(true)" />
    </n-form-item>

    <n-form-item label="定时" path="alarm">
      <n-input-number v-model:value="model.alarm" class="w-full">
        <template #suffix>
          分钟
        </template>
      </n-input-number>
    </n-form-item>

    <n-form-item label="过期" path="expired">
      <n-input-number v-model:value="model.expired" class="w-full">
        <template #suffix>
          分钟
        </template>
      </n-input-number>
    </n-form-item>

    <n-form-item label="状态列表">
      <n-switch v-model:value="model.statusList" size="small" :round="false" />
    </n-form-item>

    <n-form-item label="重置">
      <n-switch v-model:value="resetLoading" :loading="resetLoading" size="small" :round="false" @update:value="reset()" />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useMessage } from 'naive-ui'

import configState from '@models/keyValue/configState'

import type { ShowConfig } from '@services/base/model'
const module = 'base'

const message = useMessage()

const data = reactive({
  hasInit: false,
  resetLoading: false,
  initLoading: false,
  model: {} as ShowConfig,
  rules: {} as any,
})
const {
  hasInit,
  resetLoading,
  initLoading,
  model,
  rules,
} = toRefs(data)

const init = async() => {
  data.hasInit = false
  await nextTick()
  data.model = await configState.getItem(module)
  await nextTick()
  data.hasInit = true
}
init()

// 进行设置
const modelSet = async() => {
  await configState.mergeSet(module, toRaw(model.value))
}

// 初始化或重置
const reset = async(isInit = false) => {
  if (isInit)
    data.initLoading = true
  else
    data.resetLoading = true

  useTimeoutFn(async() => {
    await configState.init(isInit ? 'all' : module)
    init()

    if (isInit)
      data.initLoading = false
    else
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
