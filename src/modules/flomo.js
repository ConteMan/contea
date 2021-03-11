import dayjs from 'dayjs';
import { randomSleep, sendTabMessage } from '@/utils';
import request from '@/utils/request.js';
import { infoPut, existPlatformType } from '@/service/info.js';
import { put as platformUserPut } from '@/service/platform_user.js';
import { enablePlatformType } from '@/service/config';
import Base from './base.js';

export default class Flomo extends Base {
  constructor() {
    super();
    this.baseUrl = 'https://flomoapp.com/api';
    this.platform = 'flomo';
    this.PLATFORM_TYPE = {
      MEMO: 'flomo_memo',
    };
  }

  // 个人信息
  userInfo = async() => {
    try {
      const url = 'https://flomoapp.com/login';
      const res = await request({
        url,
      });
      const htmlDom = res.status !== 200 ? false : res.data;
      if (!htmlDom) {
        return false;
      }
      const meArray = htmlDom.match(/const[\s]me[\s]=[\s]({[\s\S]*})/);
      if (!meArray) {
        return false;
      }
      if (meArray[1]) {
        const me = JSON.parse(meArray[1]);
        return me || false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  // 标签
  tag = async() => {
    try {
      const url = this.baseUrl + '/tag';
      const res = await request({
        url,
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
      if (platformType === 'flomo_memo') {
        const syncRes = await this.syncMemo();
        res[platformType] = syncRes;
      }
    }
    return res;
  }

  // 获取 memo
  memo = async(
    {
      offset = 0
    } = {}
  ) => {
    try {
      const url = this.baseUrl + '/memo';
      const params = {
        offset
      };
      const res = await request({
        url,
        method: 'get',
        params,
        retry: 3,
      });
      return res.data;
    } catch (e) {
      return {};
    }
  }

  // 同步小记
  syncMemo = async(
    {
      offset = 0,
      force = false,
    } = {}
  ) => {
    const platformType = 'flomo_memo';
    const returnRes = {
      add: 0,
      update: 0,
      fail: 0
    };

    // 无数据时，强制更新
    if (!force) {
      const exist = await existPlatformType(this.PLATFORM_TYPE.MEMO);
      exist ? force : force = !force;
    }

    let hasMore = true;
    const pageSize = 50;
    while (hasMore) {
      const res = await this.memo({ offset });
      if (!res || !res.memos) {
        hasMore = false;
        break;
      }
      let flag = true;
      const items = res.memos;
      if (items.length > 0) {
        for (const item of items) {
          item.platform = this.platform;
          item.platform_type = platformType;
          item.info_created_at = dayjs(item.created_at).unix();
          item.info_updated_at = dayjs(item.created_at).unix();
          const putRes = await infoPut(item, ['slug']);

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
      hasMore = (items.length === pageSize) && flag;
      if (hasMore) {
        offset += pageSize;
        await randomSleep(1000, 3000);
      }
    }
    return returnRes;
  }
}
