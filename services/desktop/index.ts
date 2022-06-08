import configState from '@models/keyValue/configState'
import { defHttp } from '@utils/http/axios'

export async function toDesktop(module: string, data: any) {
  try {
    const baseConfig = await configState.getItem('base')
    const url = baseConfig?.desktopInterface ?? ''
    if (!url) return false

    return await defHttp.post({
      url,
      data: {
        type: module,
        data,
      },
    })
  }
  catch (e) {
    return false
  }
}