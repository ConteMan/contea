<template>
  <SettingItem>
    <template #left>
      <div class="ml-4 min-w-24">
        开启
      </div>
    </template>
    <template #right>
      <a-switch v-model:checked="data.v2ex.enable" checked-children="开" un-checked-children="关" @change="actionSet('v2ex', 'enable', data.v2ex.enable)" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        Token
      </div>
    </template>
    <template #right>
      <a-input v-model:value="data.v2ex.token" @blur="actionSet('v2ex', 'token', data.v2ex.token)" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        定时
      </div>
    </template>
    <template #right>
      <a-input v-model:value="data.v2ex.alarm" addon-after="分钟" @blur="actionSet('v2ex', 'alarm', Number(data.v2ex.alarm))" />
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        类型
      </div>
    </template>
    <template #right>
      <a-checkbox-group v-model:value="data.v2ex.enableTypes" name="v2exTypeCheckbox" :options="v2exTypes" @change="actionSet('v2ex', 'enableTypes', data.v2ex.enableTypes)" />
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import SettingItem from '~/components/template/SettingItem.vue'
import ConfigState from '~/models/keyValue/configState'

interface DataType {
  v2ex: {
    enable?: boolean
    token?: string
    alarm?: number
    enableTypes?: string[]
  }
}

const v2exTypes = [
  {
    label: '关注',
    value: 'members',
  },
  {
    label: '最热',
    value: 'hot',
  },
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '技术',
    value: 'tech',
  },
]

const data: UnwrapRef<DataType> = reactive({
  v2ex: {
    enable: true,
  },
})

const getSetting = async() => {
  const settings = await (await ConfigState.bulkGetItem(['v2ex'])).toArray()
  data.v2ex = settings[0]
}
getSetting()

const actionSet = async(module: string, keyName: string, data?: any) => {
  await ConfigState.mergeSet(module, { [keyName]: data })
}

const { v2ex } = toRefs(data)
watch(v2ex, (newValue, oldValue) => {
  // eslint-disable-next-line no-console
  console.log('watch:', newValue, oldValue)
})

</script>
