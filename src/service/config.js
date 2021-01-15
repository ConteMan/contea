import _ from 'lodash'
import db from '@/db'
import { platforms as allPlatforms } from '@/config'

// 保存信息
const put = async(data) => {
  const { name } = data
  let res
  await db.transaction('rw', [db.configs], async() => {
    const item = await db.configs.where('name').equals(name).first()
    if (item) {
      item.value = data.value
      res = await db.configs.put(item)
    } else {
      res = await db.configs.add(data)
    }
  })
  return res
}

// 可用平台
const enablePlatform = async() => {
  const enablePlatforms = []
  const platforms = new Set()
  const res = await db.configs
    .where('type').equals(1)
    .and((config) => {
      return config.value === 1
    })
    .toArray()
  res.map((config) => {
    platforms.add(config.platform)
  })
  for (const platform of platforms) {
    const findRes = _.find(allPlatforms, ['platform', platform])
    if (findRes) {
      enablePlatforms.push(findRes)
    }
  }
  return enablePlatforms
}

// 可用的平台类型
const enablePlatformType = async(platform) => {
  const enablePlatformTypes = []
  let res
  if (platform === 'all') {
    res = await db.configs
      .where('type').equals(1)
      .and((config) => {
        return config.value === 1
      })
      .toArray()
  } else {
    res = await db.configs
      .where('platform').equals(platform)
      .and((config) => {
        return config.value === 1 && config.type === 1
      })
      .toArray()
  }
  if (res.length > 0) {
    res.map((config) => {
      enablePlatformTypes.push(config.platform_type)
    })
  }
  return enablePlatformTypes
}

// 获取全部配置
const all = async() => {
  return await db.configs.toArray()
}

// 设置
const set = async(key, value) => {
  return await db.configs
    .where('name').equals(key)
    .modify({ value })
}

export { put, set, all, enablePlatform, enablePlatformType }
