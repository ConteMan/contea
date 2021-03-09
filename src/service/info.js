import db from '@/db';
import { enablePlatformType } from './config.js';

/**
 * 列表
 *
 * @param {Object} param0 - 参数
 * - @param platform - 平台
 * - @param offset - 偏移
 * - @param pageSize - 限制
 * - @param order - 排序字段
 *
 * @return {Array} - 数据数组
 */
const list = async(
  {
    platform = 'all',
    offset = 0,
    pageSize = 10,
    order = 'info_created_at'
  } = {}
) => {
  let res = [];
  platform = platform || 'all';
  const platformTypes = await enablePlatformType(platform);
  if (!platformTypes.length) {
    return res;
  }
  res = await db.infos
    .orderBy(order)
    .reverse() // 颠倒项目顺序
    .filter(function(item) {
      return platformTypes.includes(item.platform_type);
    })
    .offset(offset)
    .limit(pageSize) // 将结果限制为给定的项目数
    .toArray();
  return res;
};

/**
 * 保存或更新信息
 *
 * @param {Object} data - 数据
 * @param {Array} filters - 过滤参数，判断数据是否已存在
 *
 * @return {Number} - 0 失败，1 添加，2 更新
 */
const put = async(data, filters) => {
  const { platform_type } = data;
  const exist = await db.infos
    .where('platform_type').equals(platform_type)
    .filter((item) => {
      let res = true;
      for (const filter of filters) {
        if (item[filter] !== data[filter]) {
          res = false;
          break;
        }
      }
      return res;
    })
    .first();
  let res = 0;
  if (exist) {
    // 如果信息更新时间不一致，则更新
    if (exist.info_updated_at !== data.info_updated_at) {
      res = await db.infos.update(exist.info_id, data);
      res ? res = 2 : 0;
    }
  } else {
    res = await db.infos.add(data);
  }
  return res;
};

/**
 * 判断平台类型是否有数据
 *
 * @param {String} platformType - 平台类型
 *
 * @return {Boolean} - true 存在，false 不存在
 */
const existPlatformType = async(platformType) => {
  const exist = await db.infos
    .where('platform_type').equals(platformType)
    .first();
  return !!exist;
};

/**
 * 根据平台查询信息数量
 *
 * @param {String} platform - 平台名称
 *
 * @return {Number} - 数量
 */
const platformCount = async(platform) => {
  let count = 0;
  const platformTypes = await enablePlatformType(platform);
  if (!platformTypes.length) {
    return count;
  }
  count = await db.infos
    .where('platform').equals(platform)
    .filter((item) => {
      let res = true;
      for (const platformType of platformTypes) {
        if (item['platform_type'] !== platformType) {
          res = false;
          break;
        }
      }
      return res;
    })
    .count();
  return count;
};

export { list, put as infoPut, existPlatformType, platformCount };
