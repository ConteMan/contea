import db from '@/db';

// 保存信息
const put = async(data, filters = {}) => {
  const { platform } = data;
  const exist = await db.platform_users
    .where('platform').equals(platform)
    .filter((item) => {
      if (!Object.keys(filters).length) {
        return true;
      }
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
  let res;
  if (exist) {
    res = await db.platform_users.update(exist.platform_user_id, data);
  } else {
    res = await db.platform_users.add(data);
  }
  return res;
};

export { put };
