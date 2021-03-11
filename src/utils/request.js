import axios from 'axios';

const config = {
  withCredentials: true,
  timeout: 1000 * 12,

  // 自定义重试设置
  retry: 0, // 默认关闭
  retryDelay: 1000,
};
// 创建axios实例
const instance = axios.create(config);
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.error(error)
);

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  (res) => {
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res);
  },
  // 请求失败
  (error) => {
    const config = error.config;
    console.log('error', error);
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(error);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    const backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
      console.log('retry count:', config.__retryCount);
      return instance(config);
    });
  }
);

export default instance;
