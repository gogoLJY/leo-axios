import { AxiosStatic, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaultConfig from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

export function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 是一个函数
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaultConfig)

axios.create = function(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaultConfig, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function(promises) {
  return Promise.all(promises)
}

axios.spread = function(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
