<script setup lang="ts">
import type { Ref } from 'vue'
import type { SettingKeys } from '@setting/index'
import type { ShowConfig } from '@services/sspai/model'
import { configKeys } from '@services/sspai/model'
import { enumToObj } from '@utils/index'
import { TypeEnum } from '@enums/sspaiEnum'
import Setting from '../index'

const module: SettingKeys = 'sspai'

const baseTypes = ref([] as Record<string, any>[])
const getTypes = () => {
  baseTypes.value = enumToObj(TypeEnum, ['value', 'label'])
}
getTypes()

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

    <n-form-item label="信息类型" path="enableTypes">
      <n-checkbox-group v-model:value="model.enableTypes">
        <n-space item-style="display: flex;">
          <n-checkbox v-for="item in baseTypes" :key="item.value" :value="item.value" :label="item.label" />
        </n-space>
      </n-checkbox-group>
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
