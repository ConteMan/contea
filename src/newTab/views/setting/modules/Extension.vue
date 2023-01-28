<script setup lang="ts">
import type { Ref } from 'vue'
import type { SettingKeys } from '@setting/index'
import type { ShowConfig } from '@services/extension/model'
import { MODULES } from '@enums/index'
import { configKeys } from '@services/extension/model'
import Setting from '../index'

const module: SettingKeys = MODULES.EXTENSION

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
