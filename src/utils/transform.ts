import { defHttp } from './http/axios'

export async function transform(type = 'transform', module: string, moduleType: string, data: any) {
  return await defHttp.post({
    url: 'http://localhost:3000/transform',
    data: {
      type,
      module,
      moduleType,
      data,
    },
  })
}
