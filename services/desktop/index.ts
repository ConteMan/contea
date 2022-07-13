import configState from '@models/keyValue/configState'
import { defHttp } from '@utils/http/axios'

export async function toDesktop(type: string, data: any) {
  try {
    const baseConfig = await configState.getItem('base')
    const url = baseConfig?.desktopInterface ?? ''
    if (!url) return false

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
    return false
  }
}
