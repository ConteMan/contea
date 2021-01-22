const platforms = [
  {
    platform: 'yuque',
    name: '语雀',
    types: [
      {
        type: 'yuque_note',
        name: '语雀小记'
      },
    ]
  },
  {
    platform: 'zhihu',
    name: '知乎',
    type: [
      {
        type: 'zhihu_collection',
        name: '知乎收藏'
      },
      {
        type: 'zhihu_activity',
        name: '知乎动态'
      },
    ]
  },
  {
    platform: 'jike',
    name: '即刻',
    type: [
      {
        type: 'jike_activity',
        name: '即刻动态'
      },
    ]
  },
  {
    platform: 'flomo',
    name: '浮墨',
    type: [
      {
        type: 'flomo_memo',
        name: '浮墨 memo'
      },
    ]
  },
]

const platform_names = {
  yuque: '语雀',
  zhihu: '知乎',
  jike: '即刻',
  flomo: '浮墨',
}

const platform_types = {
  yuque_note: '语雀小记',
  zhihu_collection: '知乎收藏',
  zhihu_activity: '知乎动态',
  jike_activity: '即刻动态',
  flomo_memo: '浮墨 memo'
}

/**
 * platform_type 类型
 * type 1 是否开启 2 普通
 * value 0 未启用，1 启用
 */
const defaultConfig = [
  {
    name: 'yuque_note_enable',
    value: 1,
    platform: 'yuque',
    platform_type: 'yuque_note',
    type: 1,
  },
  {
    name: 'zhihu_collection_enable',
    value: 0,
    platform: 'zhihu',
    platform_type: 'zhihu_collection',
    type: 1,
  },
  {
    name: 'zhihu_activity_enable',
    value: 1,
    platform: 'zhihu',
    platform_type: 'zhihu_activity',
    type: 1,
  },
  {
    name: 'jike_activity_enable',
    value: 1,
    platform: 'jike',
    platform_type: 'jike_activity',
    type: 1,
  },
  {
    name: 'flomo_memo_enable',
    value: 1,
    platform: 'flomo',
    platform_type: 'flomo_memo',
    type: 1,
  },
  // 同步接口
  {
    name: 'sync_api_url',
    value: '',
    platform: 'sync',
    platform_type: 'sync_api',
    type: 2,
  },
]

export { platforms, platform_names, platform_types, defaultConfig }
