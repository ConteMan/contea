import { defHttp } from '@utils/http/axios'
import { ConfigModel } from '@models/index'

/**
 * 获取桌面端接口是否可用
 */
export async function getEnable() {
  try {
    const { enableDesktop, desktopInterface, desktopInterfaceStatus } = await ConfigModel.getItem('base')
    return enableDesktop && desktopInterface && desktopInterfaceStatus
  }
  catch (e) {
    return false
  }
}

/**
 * 检测桌面端接口连通状态
 */
export async function checkConnect() {
  try {
    const { enableDesktop, desktopInterface } = await ConfigModel.getItem('base')
    if (!enableDesktop || !desktopInterface) {
      await ConfigModel.mergeSet('base', { desktopInterfaceStatus: false })
      return false
    }

    const res = await defHttp.post({
      url: desktopInterface,
    })
    const desktopInterfaceStatus = [200, 204].includes(res.status)
    await ConfigModel.mergeSet('base', { desktopInterfaceStatus })
    return desktopInterfaceStatus
  }
  catch (e) {
    await ConfigModel.mergeSet('base', { desktopInterfaceStatus: false })
    return false
  }
}

/**
 * 向桌面端接口发送请求
 * @param type - 请求类型
 * @param data - 请求数据
 */
export async function toDesktop(type: string, data: any) {
  try {
    const { enableDesktop, desktopInterface, desktopInterfaceStatus } = await ConfigModel.getItem('base')
    const url = enableDesktop && desktopInterface && desktopInterfaceStatus ? desktopInterface : false
    if (!url)
      return false

    return await defHttp.post({
      url,
      data: {
        type,
        data,
      },
    })
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log('>>> desktop >> toDesktop error', e)

    await ConfigModel.mergeSet('base', { desktopInterfaceStatus: false })
    return false
  }
}
