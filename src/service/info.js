import db from '@/db'
import { enablePlatformType } from './config.js'

const list = async({ platform = 'all', offset = 0, pageSize = 10, order = 'info_created_at' } = {}) => {
  let res = []
  platform = platform || 'all'
  const platformTypes = await enablePlatformType(platform)
  if (!platformTypes.length) {
    return res
  }
  res = await db.infos
    .orderBy(order)
    .reverse() // 颠倒项目顺序
    .filter(function(item) {
      return platformTypes.includes(item.platform_type)
    })
    .offset(offset)
    .limit(pageSize) // 将结果限制为给定的项目数
    .toArray()
  return res
}

// 保存信息
const put = async(data, filters) => {
  const { platform_type } = data
  const exist = await db.infos
    .where('platform_type').equals(platform_type)
    .filter((item) => {
      let res = true
      for (const filter of filters) {
        if (item[filter] !== data[filter]) {
          res = false
          break
        }
      }
      return res
    })
    .first()
  let res = 0
  if (exist) {
    if (exist.info_updated_at !== data.info_updated_at) {
      res = await db.infos.add(exist.info_id, data)
    }
  } else {
    res = await db.infos.add(data)
  }
  return res
}

export { list, put }
