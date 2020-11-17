import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import XHR from './xhr'
import { buildUrl } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

// 采用指责分离
//  优点：逻辑清晰
function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)

  return XHR(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  config.headers = transformHeaders(config) // 底下 data已经转换成 字符串
  config.data = transfromRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config

  return buildUrl(url, params)
}

function transfromRequestData(config: AxiosRequestConfig) {
  const { data } = config

  return transformRequest(data)
}
function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse) {
  res.data = transformResponse(res.data)

  return res
}

export default axios
