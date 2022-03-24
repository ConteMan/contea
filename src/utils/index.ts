import { isObject } from '~/utils/is'

export const noop = () => {}

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
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  // eslint-disable-next-line no-restricted-syntax
  for (key in target)
    src[key] = isObject(src[key]) && !(src[key] instanceof Array) ? deepMerge(src[key], target[key]) : (src[key] = target[key])

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
 * @param data {} - 枚举值
 * @param mode number - 模式
 * @param keys [] - 对象键
 */
type dataType = Record<string, any>;
export function enumToObj(data: dataType, keys: any[] = ['key', 'value']) {
  const res = []
  const indexs = Object.keys(data)
  for (const index of indexs) {
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
