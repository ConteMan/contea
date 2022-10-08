<script setup lang="ts">
import type { Ref } from 'vue'
import type { SettingKeys } from '@setting/index'
import type { ShowConfig } from '@services/one/model'
import { configKeys } from '@services/one/model'
import Setting from '../index'

const module: SettingKeys = 'sport'

const setting = Setting(module, configKeys)
const { rules, resetLoading, reset } = setting
const { model }: { model: Ref<ShowConfig> } = setting
</script>

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

    <n-form-item label="任务定时" path="alarm">
      <n-input-number v-model:value="model.alarm" class="w-full">
        <template #suffix>
          分钟
        </template>
      </n-input-number>
    </n-form-item>

    <n-form-item label="重置">
      <n-switch
        v-model:value="resetLoading"
        :loading="resetLoading"
        :round="false"
        size="small"
        @update:value="reset(module)"
      />
    </n-form-item>
  </n-form>
</template>
