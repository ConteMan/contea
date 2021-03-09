import { sleep, getRandomIntInclusive } from '@/utils';
import request from '@/utils/request.js';
import { infoPut, existPlatformType } from '@/service/info.js';
import { put as platformUserPut } from '@/service/platform_user.js';
import { enablePlatformType } from '@/service/config';

export default class Juejin {
  constructor() {
    this.baseUrl = 'https://api.juejin.cn';
    this.platform = 'juejin';
    this.PLATFORM_TYPE = {
      ACTIVITY: 'juejin_activity',
    };
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Juejin();
    }
    return this.instance;
  }

  // 个人信息
  userInfo = async() => {
    const url = this.baseUrl + '/user_api/v1/user/get';
    const res = await request({
      url,
      method: 'get',
    });
    return res.status !== 200 ? false : res.data;
  }

  // 登录状态
  loginStatus = async() => {
    const res = await this.userInfo();
    if (!res) {
      return 0;
    } else {
      this.putPlatformUser(res.data);
      return 1;
    }
  }

  // 保存个人信息
  putPlatformUser = async(data = {}) => {
    if (!data) {
      const res = await this.userInfo();
      data = res.data;
    }
    data.platform = this.platform;
    return await platformUserPut(data);
  }

  // 同步数据
  sync = async() => {
    const res = {};
    const loginStatus = await this.loginStatus();
    if (!loginStatus) {
      return res;
    }
    const platformTypes = await enablePlatformType(this.platform);
    for (const platformType of platformTypes) {
      if (platformType === this.PLATFORM_TYPE.ACTIVITY) {
        const syncRes = await this.syncActivity();
        res[platformType] = syncRes;
      }
    }
    return res;
  }

  // 个人动态
  activity = async(
    {
      user_id = 0,
      cursor = 0
    } = {}
  ) => {
    const url = this.baseUrl + '/user_api/v1/user/dynamic';
    const params = { user_id, cursor };

    const res = await request({
      url,
      method: 'get',
      params,
    });
    return res.data;
  }

  /**
   * 同步个人动态
   *
   * @param {Object} param0 - 参数
   * - @param {Number} user_id -  用户ID
   * - @param {Number} cursor - 游标
   * - @param {Boolean} force - 强制更新
   * @returns
   */
  syncActivity = async(
    {
      cursor = 0,
      force = true,
    } = {}
  ) => {
    const returnRes = {
      success: 0,
      fail: 0
    };

    // 无数据时，强制更新
    if (!force) {
      const exist = await existPlatformType(this.PLATFORM_TYPE.ACTIVITY);
      exist ? force : force = !force;
    }
    const user = await this.userInfo();
    if (!user) {
      return returnRes;
    }
    const user_id = user.user_id;
    let hasMore = true;
    while (hasMore) {
      const res = await this.activity({ user_id, cursor });
      const items = res['data'].list;
      let flag = true;
      if (items.length > 0) {
        for (const item of items) {
          item.platform = this.platform;
          item.platform_type = this.PLATFORM_TYPE.ACTIVITY;
          item.info_created_at = item.time;
          item.info_updated_at = item.time;

          const putRes = await infoPut(item, ['id', 'time']);
          if (putRes) {
            returnRes.success++;
          } else {
            if (!force) {
              flag = false;
              break;
            } else {
              returnRes.fail++;
            }
          }
        }
      }
      hasMore = res.data.hasMore && flag;
      if (hasMore) {
        cursor = res.data.cursor;
      }
      const sleepTime = getRandomIntInclusive(1000, 3000);
      await sleep(sleepTime);
    }
    return returnRes;
  }
}
