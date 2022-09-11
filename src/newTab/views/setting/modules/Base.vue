<script setup lang="ts">
import type { SettingKeys } from '@setting/index'
import type { ShowConfig } from '@services/base/model'
import type { Ref } from 'vue'

import { configKeys } from '@services/base/model'
import { useNewTabState } from '@newTab/store/newTab'
import { checkConnect } from '@services/desktop'
import Setting from '../index'

const module: SettingKeys = 'base'

const setting = Setting(module, configKeys)
const { rules, resetLoading, reset, initConfig, initConfigLoading } = setting
const { model }: { model: Ref<ShowConfig> } = setting

const newTabState = useNewTabState()
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
    <n-form-item label="定时">
      <n-input-number v-model:value="model.alarm" class="w-full">
        <template #suffix>
          分钟
        </template>
      </n-input-number>
    </n-form-item>

    <n-form-item label="定时任务列表">
      <n-switch v-model:value="model.statusList" size="small" :round="false" />
    </n-form-item>

    <n-form-item label="主题模式">
      <n-switch v-model:value="model.themeMode" size="small" :round="false" @update:value="newTabState.setThemeMode()">
        <template #checked>
          手动
        </template>
        <template #unchecked>
          系统
        </template>
      </n-switch>
    </n-form-item>

    <n-form-item label="启用桌面端通讯">
      <n-switch v-model:value="model.enableDesktop" size="small" :round="false" />
    </n-form-item>
    <n-form-item label="桌面端接口">
      <n-input v-model:value="model.desktopInterface" class="w-[80%]" />
      <div v-if="model.desktopInterface" class="flex items-center px-2">
        <mdi-wifi class="cursor-pointer" :style="{ color: model.desktopInterfaceStatus ? 'green' : 'red' }" @click="checkConnect()" />
      </div>
    </n-form-item>

    <n-form-item label="重置">
      <n-switch v-model:value="resetLoading" :loading="resetLoading" size="small" :round="false" @update:value="reset(module)" />
    </n-form-item>

    <n-divider />

    <n-form-item label="# 恢复默认配置">
      <n-switch v-model:value="initConfigLoading" :loading="initConfigLoading" size="small" :round="false" @update:value="initConfig()" />
    </n-form-item>
  </n-form>
</template>
