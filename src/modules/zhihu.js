import { fetchAsync } from "@/utils"

export default class Zhihu {
  constructor() {
    this.option = {};
  }

  static getInstance() {
    if(!this.instance) {
      this.instance = new Zhihu();
    }
    return this.instance;
  }

  getUser = async () => {
    return await fetchAsync('https://www.zhihu.com/api/v4/me', this.option);
  }

  formatData = async () => {
    let data = {
      site: {
        name: '知乎',
        url: 'https://zhihu.com'
      },
      user: {},
      detail: {},
    };
    data.user = await this.getUser();
    data.detail = {};
    console.log(data);
    return data;
  }
}
