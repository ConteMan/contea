<template>
  <div class="w-full max-w-[700px] mb-4">
    <n-collapse v-model:expanded-names="expandedNames" class="max-w-full">
      <template v-for="item in list" :key="item.name">
        <n-collapse-item :name="item.name" :title="item.title">
          <component :is="item.component" />
        </n-collapse-item>
      </template>
    </n-collapse>
  </div>
</template>
<script lang="ts" setup>

const modules: any = {}
const file = import.meta.globEager('./modules/*.vue')
const paths = Object.keys(file)
paths.forEach((path) => {
  const key = path.replace('./modules/', '').replace('.vue', '')
  modules[key] = file[path].default
})

const list = [
  {
    name: 'base',
    title: '基础',
    component: modules.SettingItemBase,
  },
  {
    name: 'bgm',
    title: '番组计划',
    component: modules.SettingItemBgm,
  },
  {
    name: 'bilibili',
    title: '哔哩哔哩',
    component: modules.SettingItemBilibili,
  },
  {
    name: 'github',
    title: 'Github',
    component: modules.SettingItemGithub,
  },
  {
    name: 'jike',
    title: '即刻',
    component: modules.SettingItemJike,
  },
  {
    name: 'juejin',
    title: '掘金',
    component: modules.SettingItemJuejin,
  },
  {
    name: 'movie',
    title: '影视',
    component: modules.SettingItemMovie,
  },
  {
    name: 'one',
    title: '一个',
    component: modules.SettingItemOne,
  },
  {
    name: 'sport',
    title: '体育',
    component: modules.SettingItemSport,
  },
  {
    name: 'sspai',
    title: '少数派',
    component: modules.SettingItemSspai,
  },
  {
    name: 'v2ex',
    title: 'V2EX',
    component: modules.SettingItemV2ex,
  },
  {
    name: 'wakatime',
    title: 'WakaTime',
    component: modules.SettingItemWakaTime,
  },
  {
    name: 'wallpaper',
    title: '壁纸',
    component: modules.SettingItemWallpaper,
  },
  {
    name: 'weread',
    title: '微信读书',
    component: modules.SettingItemWeread,
  },
  {
    name: 'zhihu',
    title: '知乎',
    component: modules.SettingItemZhihu,
  },
  {
    name: 'test',
    title: '测试',
    component: modules.SettingItemTest,
  },
]

const expandedNames = ref([])
</script>

<style scoped lang="less">
.n-collapse .n-collapse-item {
  margin: 0.5rem 0 0 0;
  background-color: rgba(209, 213, 219, 0.178);
  border-radius: 0.25rem;
  :deep(.n-collapse-item__header) {
    padding: 1rem;
  }
  :deep(.n-collapse-item__content-wrapper) {
    padding: 0 2rem 0 2rem;
  }
  :deep(.n-collapse-item__content-inner) {
    padding-top: 0;
  }
}
</style>
