<template>
  <SettingItem>
    <template #left>
      <div class="ml-4 min-w-24">
        开启
      </div>
    </template>
    <template #right>
      <a-switch v-model:checked="data.base.enable" checked-children="开" un-checked-children="关" @change="actionSet('enable', data.base.enable)" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        定时
      </div>
    </template>
    <template #right>
      <a-input v-model:value="data.base.alarm" addon-after="分钟" @blur="actionSet('alarm', Number(data.base.alarm))" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        重置
      </div>
    </template>
    <template #right>
      <a-button type="text" class="bg-gray-200" @click="reset()">
        确定
      </a-button>
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import type { ShowConfig } from '~/services/weather/model'

import SettingItem from '~/components/template/SettingItem.vue'
import ConfigState from '~/models/keyValue/configState'

const module = 'weather'

// 订阅设置
interface DataType {
  base: ShowConfig
}
const data: UnwrapRef<DataType> = reactive({
  base: {
    key: '',
    name: '',
    enable: true,
    site: '',
    apiUrl: '',
    expried: 0,
    alarm: 0,
    showCard: true,
  },
})
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
  await ConfigState.init(module)
}
</script>
