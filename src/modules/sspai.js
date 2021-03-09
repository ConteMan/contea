import request from '@/utils/request.js';
export default class Sspai {
  constructor() {
    this.baseUrl = 'https://sspai.com/api/v1';
    this.token = '';
    this.headers = {};
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Sspai();
    }
    return this.instance;
  }

  // 获取 Token，并组装请求 Header
  getToken = async() => {
    // eslint-disable-next-line no-undef
    const cookie = await browser.cookies.get(
      {
        url: 'https://sspai.com',
        name: 'sspai_jwt_token'
      }
    );
    this.token = cookie.value;
    this.headers = {
      'Authorization': 'Bearer ' + this.token,
    };
    return cookie.value;
  }

  // 获取用户信息
  userInfo = async() => {
    if (!this.token) await this.getToken();
    const url = this.baseUrl + '/user/info/get';
    const res = await request({
      url,
      method: 'get',
      headers: this.headers,
    });
    return res;
  }

  // 登录检测
  loginStatus = async() => {
    if (!this.token) await this.getToken();
    const res = await this.userInfo();
    if (!res) {
      return 0;
    } else {
      return 1;
    }
  }
}
