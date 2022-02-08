<template>
  <div class="max-w-[600px] relative">
    <div class="tags sticky top-0 w-full max-w-[600px] bg-white pb-2 pl-2 pr-2">
      <a class="cursor-pointer leading-none align-middle mr-4" @click="refresh()">
        <mdi-refresh :class="{'animate-spin': loading }" />
      </a>
      <template v-for="item in moduleTypes" :key="item.key">
        <a-checkable-tag
          :checked="selectedTag === item.value"
          @change="checked => handleChange(item.value, checked)"
        >
          {{ item.key }}
        </a-checkable-tag>
      </template>
      <n-time v-if="extendInfo.ca_updated_at" class="text-light-800 italic text-xs float-right cursor-default hover:(text-gray-400)" :time="0" :to="new Date().getTime() - extendInfo.ca_updated_at" type="relative" />
    </div>

    <div class="mt-2 mb-4">
      <div v-if="error">
        Error
      </div>
      <template v-else>
        <div v-for="item in list" :key="item.url" class="item-container p-2 pl-4 mb-2 rounded-sm bg-origin-padding bg-center bg-cover cursor-default hover:(bg-blend-lighten)" :style="itemStyle(item)">
          <div class="item-content duration-500">
            <div>
              <a class="hover:(underline underline-offset-2 duration-200 animate-pulse)" :href="`${config.module.libvio.site}/${item.url}`">{{ item.title }}</a>
            </div>
            <div>
              {{ item.des }} {{ item.tag }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { enumToObj } from '~/utils'

import type { Config } from '~/services/movie/model'
import { LibvioTypeEnum } from '~/enums/movieEnum'
import Base from '~/services/movie'
import configState from '~/models/keyValue/configState'

const module = 'movie'
const defaultType = 'latest'

const data = reactive({
  loading: true,
  config: {} as Config,
  error: false,
  moduleTypes: {} as any,
  selectedTag: defaultType,
  list: [] as any[],
  extendInfo: {} as any,
})
const { loading, config, error, moduleTypes, selectedTag, list, extendInfo } = toRefs(data)

// 列表数据
const getList = async(refresh = false) => {
  const res = await Base.libvio(refresh, selectedTag.value)
  if (Object.keys(res).length) {
    const { ca_updated_at, ca_expried, data: listData } = res
    data.list = listData
    data.extendInfo = { ca_updated_at, ca_expried }
    data.loading = false
  }
  else {
    data.error = true
  }
}

const init = async() => {
  data.config = await configState.getItem(module)
  getList()
}
init()

// 获取栏目类型
const getTypes = () => {
  data.moduleTypes = enumToObj(LibvioTypeEnum, ['value', 'key'])
}
getTypes()

// 选择标签
const handleChange = (tag: string, checked: boolean) => {
  data.selectedTag = checked ? tag : defaultType
  getList()
}

// 刷新数据
const refresh = async() => {
  data.loading = true
  await getList(true)
  data.loading = false
}

const itemStyle = (data: any) => {
  return {
    'background-image': data.pic_url ? `linear-gradient(45deg, rgb(229, 231, 231, 0.9), rgb(116, 115, 115, 70%)), url(${data.pic_url}` : '',
  }
}
</script>

<style lang="less" scoped>
.item-container:hover {
  .item-content {
    transform: translateX(0.8rem);
  }
}
</style>
