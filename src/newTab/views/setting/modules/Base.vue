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
</template>

<script setup lang="ts">
import SettingItem from '~/components/template/SettingItem.vue'
import ConfigState from '~/models/keyValue/configState'
</script>
