import { defHttp } from '@utils/http/axios'
import { MODULES } from '@enums/index'
import RequestCache from '@services/base/requestCache'

const stationData = {
  location: {
    id: '59493',
    name: '深圳',
    path: '中国, 广东, 深圳',
    longitude: 114.0,
    latitude: 22.53,
    timezone: 8,
  },
  daily: [
    {
      date: '2099/10/19',
      high: 26.0,
      dayText: '多云',
      dayCode: 1,
      dayWindDirection: '无持续风向',
      dayWindScale: '微风',
      low: 20.0,
      nightText: '多云',
      nightCode: 1,
      nightWindDirection: '无持续风向',
      nightWindScale: '微风',
    },
  ],
  now: {
    precipitation: 0.0,
    temperature: 23.6,
    pressure: 1008.0,
    humidity: 46.0,
    windDirection: '东北风',
    windDirectionDegree: 43.0,
    windSpeed: 3.0,
    windScale: '微风',
  },
  alarm: [],
  lastUpdate: '2099/10/19 17:05',
}

export type StationType = typeof stationData

export interface StationCacheType {
  data: StationType
  ca_expired_at?: number
  cache_sign?: 'set' | 'get'
}

/**
 * 地域天气
 * @param stationId number - 地域代码
 */
export const station = async (stationId: number | undefined = undefined, refresh = false): Promise<StationCacheType | false> => {
  const MODULE = MODULES.WEATHER
  const url = 'https://weather.cma.cn/api/weather/view'
  const cacheStationId = stationId ?? 'default'

  const cacheKey = [MODULE, cacheStationId]
  if (!refresh) {
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData
  }

  try {
    const res = await defHttp.get({
      url,
      params: {
        stationId,
      },
    })

    if (res.data.data)
      return await RequestCache.set(cacheKey, { data: res.data.data }, MODULE, -1)

    return false
  }
  catch (e) {
    return false
  }
}
