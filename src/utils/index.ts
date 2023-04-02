import _ from 'lodash-es'
import { isObject } from './is'

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''

  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function deepMerge<T = any>(src: any = {}, target: any = {}, deep = 0, targetDeep = 0): T {
  let key: string
  targetDeep++

  for (key in target)
    src[key] = (isObject(src[key]) && !(Array.isArray(src[key])) && (!deep || targetDeep > deep)) ? deepMerge(src[key], target[key], deep, targetDeep) : (src[key] = target[key])

  return src
}

/**
 * Open site
 * @param url string
 */
type targets = '_blank' | '_self' | '_parent' | '_top'
export function openSite(url: string, target: targets = '_blank'): void {
  window.open(url, target)
}

/**
 * 字符串首字母大写
 * @param str string - 字符串
 * @returns string
 */
export function firstUpper(str: string) {
  return str.replace(str[0], str[0].toUpperCase())
}

/**
 * 枚举转对象
 * @param data - 枚举值
 * @param keys - 对象键
 */
type dataType = Record<string, any>
export function enumToObj(data: dataType, keys: string[] = ['key', 'value']) {
  const res = [] as Record<string, any>[]
  const indexArr = Object.keys(data)
  for (const index of indexArr) {
    res.push({
      [keys[0]]: index,
      [keys[1]]: data[index],
    })
  }
  return res
}

/**
 * 对象转数组
 * @param data - 对象
 * @param key - 对象键别名
 */
export function objToArray(data: any, key: (string | false) = false) {
  const keys = Object.keys(data)
  if (!keys.length)
    return []

  const array = []
  for (let i = 0; i < keys.length; i++) {
    const item = { ...data?.[keys[i]] }
    if (key)
      item[key] = keys[i]

    array.push(item)
  }

  return array
}

/**
 * 获取两数之间的随机整数，包含两数
 * @param min number - 最小
 * @param max number - 最大
 * @returns {number}
 */
export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

/**
 * 休眠等待
 * @param time - 毫秒数
 */
export function sleep(time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

interface Message {
  type: string
  [other: string]: any
}
/**
 * 向 Background 发送信息
 * @param message - 信息体
 */
export async function sendToBackground(message: Message) {
  try {
    return await browser.runtime.sendMessage(message)
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log('[ sendToBackground e ] >', e)
    return false
  }
}

/**
 * 激活下一个标签页
 * （如果是最后一个标签页，则激活第一个标签页）
 */
export async function nextTab(tabId = 0) {
  try {
    let dealTabId = tabId
    if (!dealTabId) {
      const currentTab = await browser.tabs.getCurrent()
      if (!currentTab.id)
        return false
      dealTabId = currentTab.id
    }

    const tabs = await browser.tabs.query({ currentWindow: true }) // 当前窗口全部标签页
    const index = _.findIndex(tabs, (item) => {
      return item.id === dealTabId
    })

    if (index < 0)
      return false

    const nextId = index < tabs.length - 1 ? tabs[index + 1].id : tabs[0].id
    if (nextId)
      void browser.tabs.update(nextId, { active: true })
    return true
  }
  catch (e) {
    return false
  }
}

/**
 * 激活上一个标签页
 * （如果是第一个标签页，则激活最后一个标签页）
 */
export async function preTab(tabId = 0) {
  try {
    let dealTabId = tabId
    if (!dealTabId) {
      const currentTab = await browser.tabs.getCurrent()
      if (!currentTab.id)
        return false
      dealTabId = currentTab.id
    }

    const tabs = await browser.tabs.query({ currentWindow: true }) // 当前窗口全部标签页
    const index = _.findIndex(tabs, (item) => {
      return item.id === dealTabId
    })

    if (index < 0)
      return false

    const preId = index > 0 ? tabs[index - 1].id : tabs[tabs.length - 1].id
    if (preId)
      void browser.tabs.update(preId, { active: true })
    return true
  }
  catch (e) {
    return false
  }
}

/**
 * 移动标签页
 * @param tabId - 标签页 ID
 * @param direction - 移动方向
 */
export async function moveToTab(direction: 'pre' | 'next' = 'next', tabId = 0) {
  try {
    let dealTabId = tabId
    if (!dealTabId) {
      const currentTab = await browser.tabs.getCurrent()
      if (!currentTab.id)
        return false
      dealTabId = currentTab.id
    }

    const tabs = await browser.tabs.query({ currentWindow: true }) // 当前窗口全部标签页
    const index = _.findIndex(tabs, (item) => {
      return item.id === dealTabId
    })

    if (index < 0)
      return false

    let dealIndex = index
    if (direction === 'pre') { // 向前（左侧）移动
      dealIndex = index > 0 ? (index - 1) : (tabs.length - 1)
    }
    else {
      dealIndex = index < (tabs.length - 1) ? (index + 1) : 0
    }
    void browser.tabs.move(dealTabId, { index: dealIndex })
    return true
  }
  catch (e) {
    return false
  }
}

/**
 * 判断键盘事件是否为内容输入
 */
export const isTypedCharValid = ({
  keyCode,
  metaKey,
  ctrlKey,
  altKey,
}: KeyboardEvent) => {
  if (metaKey || ctrlKey || altKey)
    return false

  // 0...9
  if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105))
    return true

  // a...z
  if (keyCode >= 65 && keyCode <= 90)
    return true

  // All other keys.
  return false
}
