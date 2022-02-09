<template>
  <SettingItem>
    <template #left>
      <div class="ml-4">
        初始化
      </div>
    </template>
    <template #right>
      <a-button type="text" class="bg-gray-200" @click="ConfigState.init()">
        确定
      </a-button>
    </template>
  </SettingItem>

  <SettingItem class="mt-2">
    <template #left>
      <div class="ml-4 min-w-24">
        默认定时
      </div>
    </template>
    <template #right>
      <a-input v-model:value="data.base.alarm" addon-after="分钟" @blur="actionSet('alarm', Number(base.alarm))" />
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
import SettingItem from '~/components/template/SettingItem.vue'
import ConfigState from '~/models/keyValue/configState'

const module = 'default'

const data = reactive({
  base: {
    alarm: 0,
  },
})
const { base } = toRefs(data)

ConfigState.data[`${module}$`](
  (value: any, key: any) => {
    data.base = value
  },
  { immediate: true },
)

// 进行设置
const actionSet = async(keyName: string, data?: any) => {
  await ConfigState.mergeSet(module, { [keyName]: data })
}

const reset = async() => {
  await ConfigState.init(module)
}
</script>
