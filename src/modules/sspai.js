import { fetchAsync } from "@/utils"

export default class Sspai {
  constructor() {
    this.token = '';
    this.option = {};
  }

  static getInstance() {
    if(!this.instance) {
      this.instance = new Sspai();
    }
    return this.instance;
  }

  getToken = async () => {
    const cookie = await browser.cookies.get({url: "https://sspai.com", name: "sspai_jwt_token"});
    this.token = cookie.value;
    this.option.headers = {
      'Authorization': 'Bearer ' + this.token,
    };
    return cookie.value;
  }

  getUser = async () => {
    if(!this.token) await this.getToken();
    return await fetchAsync('https://sspai.com/api/v1/user/info/get', this.option);
  }

  getDetail = async (slug) => {
    if(!this.token) await this.getToken();
    await fetchAsync('https://sspai.com/api/v1/user/slug/info/get?slug='+ slug, this.option);
  }

  formatData = async () => {
    let data = {
      user: {},
      detail: {},
    };
    const user = await this.getUser();
    const slug = user.data.slug;
    const detail = await this.getDetail(slug);
    data.user = user;
    data.detail = detail;
    return data;
  }
}
