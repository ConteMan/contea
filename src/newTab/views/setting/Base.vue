<script setup lang="ts">
import type { ConfigShow } from '@services/base/model'
import type { Ref } from 'vue'

import { configKeys } from '@services/base/model'
import { useNewTabState } from '@newTab/store/index'
import { checkConnect } from '@services/desktop'
import Setting from './index'
import type { ModuleKey } from '~/config/index'

const module: ModuleKey = 'base'

const setting = Setting(module, configKeys)
const { rules, resetLoading, reset, initConfig, initConfigLoading } = setting
const { model }: { model: Ref<ConfigShow> } = setting

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

    <n-form-item label="主题">
      <n-switch v-model:value="model.themeMode" size="small" :round="false" @update:value="newTabState.setThemeMode()">
        <template #checked>
          手动
        </template>
        <template #unchecked>
          系统
        </template>
      </n-switch>
    </n-form-item>

    <n-form-item label="重置">
      <n-switch v-model:value="resetLoading" :loading="resetLoading" size="small" :round="false" @update:value="reset(module)" />
    </n-form-item>

    <n-divider title-placement="left">
      <span class="text-[12px]">桌面端</span>
    </n-divider>

    <n-form-item label="开启">
      <n-switch v-model:value="model.enableDesktop" size="small" :round="false" />
    </n-form-item>
    <n-form-item label="接口">
      <n-input v-model:value="model.desktopInterface" class="w-[80%]" />
      <div v-if="model.desktopInterface" class="flex items-center px-2" :title="model.desktopInterfaceStatus ? 'success' : 'fail'">
        <mdi-wifi class="cursor-pointer" :style="{ color: model.desktopInterfaceStatus ? 'green !important' : 'red !important' }" @click="checkConnect()" />
      </div>
    </n-form-item>

    <n-divider title-placement="left">
      <span class="text-[12px]">全局</span>
    </n-divider>

    <n-form-item label="增量初始化">
      <n-switch :value="initConfigLoading === 'increase'" :loading="initConfigLoading === 'increase'" size="small" :round="false" @update:value="initConfig('increase')" />
    </n-form-item>

    <n-form-item label="重置初始化">
      <n-switch :value="initConfigLoading === 'all'" :loading="initConfigLoading === 'all'" size="small" :round="false" @update:value="initConfig('all')" />
    </n-form-item>
  </n-form>
</template>
