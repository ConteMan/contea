// 判断 JSON 字符串
const isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj == 'object' && obj);
    } catch (e) {
      return false;
    }
  }
  return !!(typeof str == 'object' && str);
};

// 读取本地缓存
const readLocalStorage = async(key) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get([key], function(result) {
      if (result[key] !== undefined) {
        resolve(result[key]);
      } else {
        reject();
      }
    });
  });
};

// 「睡眠」
const sleep = async(time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

// 获取范围内的整数，包含最大、最小值
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomSleep = (min, max) => {
  const time = getRandomIntInclusive(min, max);
  return sleep(time);
};

// 获取数组项
const getArrayItem = (array = [], key, value) => {
  let res = {};
  if (!array.length) {
    return res;
  }
  for (const item of array) {
    if (item[key] === value) {
      res = item;
      break;
    }
  }
  return res;
};

// 发送一次性信息
const sendTabMessage = (tabId, message) => {
  // eslint-disable-next-line no-undef
  chrome.tabs.sendMessage(tabId, message);
};

// 获取当前 TAB ID
const getTabId = () => {
  return new Promise(resolve => {
    // eslint-disable-next-line no-undef
    chrome.tabs.getCurrent(tab => {
      resolve(tab);
      return true;
    });
  });
};

export {
  isJSON,
  readLocalStorage,
  sleep,
  getRandomIntInclusive,
  randomSleep,
  getArrayItem,
  sendTabMessage,
  getTabId,
};
