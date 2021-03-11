import request from '@/utils/request.js';
import { randomSleep, sendTabMessage } from '@/utils/index.js';
import { infoPut, existPlatformType } from '@/service/info.js';
import { put as platformUserPut } from '@/service/platform_user.js';
import { enablePlatformType } from '@/service/config';
import Base from './base';

export default class Zhihu extends Base {
  constructor() {
    super();
    this.baseUrl = 'https://www.zhihu.com/api';
    this.platform = 'zhihu';
    this.url_username = '';
    this.PLATFORM_TYPE = {
      ACTIVITY: 'yuque_note',
    };
  }

  // 个人信息
  userInfo = async() => {
    try {
      const url = this.baseUrl + '/v4/me';
      const res = await request({
        url,
        method: 'get',
      });
      return res.status !== 200 ? false : res.data;
    } catch (e) {
      return false;
    }
  }

  // 登录状态
  loginStatus = async() => {
    const res = await this.userInfo();
    if (!res) {
      return 0;
    } else {
      this.putPlatformUser(res);
      return 1;
    }
  }

  // 保存个人信息
  putPlatformUser = async(data = {}) => {
    if (!data) {
      data = await this.userInfo();
    }
    if (data) {
      data.platform = this.platform;
      return await platformUserPut(data);
    }
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
      if (platformType === 'zhihu_activity') {
        const syncRes = await this.syncActivity();
        res[platformType] = syncRes;
      }
    }
    return res;
  }

  // 动态
  activity = async(
    {
      url = '',
      limit = 5,
      desktop = 'true',
      session_id = '',
      after_id = '',
    } = {}
  ) => {
    try {
      let res;
      if (!url) {
        url = this.baseUrl + '/v3/moments/' + this.url_username + '/activities';
        const params = { limit, desktop, session_id, after_id };
        res = await request({
          url,
          params,
        });
      } else {
        res = await request({
          url,
          method: 'get',
          retry: 3,
        });
      }
      return res.data ? res.data : {};
    } catch (e) {
      return {};
    }
  }

  // 同步动态
  syncActivity = async(
    {
      force = false, // 强制更新
    } = {}
  ) => {
    const returnRes = {
      add: 0,
      update: 0,
      fail: 0
    };
    const userInfo = await this.userInfo();
    if (!userInfo) {
      return returnRes;
    }

    // 无数据时，强制更新
    if (!force) {
      const exist = await existPlatformType(this.PLATFORM_TYPE.ACTIVITY);
      exist ? force : force = !force;
    }

    this.url_username = userInfo.url_token;
    let url = 'https://www.zhihu.com/api/v3/moments/' + this.url_username + '/activities?limit=5&desktop=true';
    let hasMore = true;
    while (hasMore) {
      const res = await this.activity({ url });
      if (!res.data) {
        hasMore = false; // 未获取到信息时退出
        break;
      }
      let flag = true; // 是否结束
      const items = res.data;
      if (items.length > 0) {
        for (const item of items) {
          item.platform = this.platform;
          item.platform_type = 'zhihu_activity';
          item.info_created_at = item.created_time;
          item.info_updated_at = item.created_time;
          const putRes = await infoPut(item, ['created_time']);
          if (putRes > 0) {
            returnRes.add++;
          } else if (putRes === 0) {
            if (!force) {
              flag = false;
            }
            returnRes.fail++;
          } else {
            returnRes.update++;
          }
          sendTabMessage(this.tabId, { type: 'syncRes', res: returnRes });
          if (!flag) break;
        }
      }
      hasMore = !res.paging.is_end && flag;
      if (hasMore) {
        url = res.paging.next;
        await randomSleep(1000, 5000);
      }
    }
    return returnRes;
  }
}
