import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import XHR from './xhr'
import { buildUrl, isAbsoluteUrl, combineUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

// 采用指责分离
//  优点：逻辑清晰
export function dispathRequest(config: AxiosRequestConfig): AxiosPromise {
  // 看是否调用过 取消，取消过就不用再请求了
  throwIfCancellationRequested(config)
  processConfig(config)

  return XHR(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, baseUrl, paramsSerializer } = config

  if (baseUrl && !isAbsoluteUrl(url!)) {
    url = combineUrl(baseUrl, url)
  }
  return buildUrl(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse) {
  res.data = transform(res.data, res.headers, res.config.transformResponse!)

  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
