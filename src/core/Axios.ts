import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import { dispathRequest, transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'

import { isString } from '../helpers/utils'
import mergeConfig from './mergeConfig'

interface Interceptor {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptor

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig

    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (isString(url)) {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispathRequest,
        rejected: undefined
      }
    ]
    // 先添加的后执行
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    // 先添加的先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!

      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  post(url: string, data: any, config: AxiosRequestConfig) {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data: any, config: AxiosRequestConfig) {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data: any, config: AxiosRequestConfig) {
    return this._requestMethodWithData('patch', url, data, config)
  }

  getUri(config: AxiosRequestConfig) {
    config = mergeConfig(this.defaults, config)

    return transformURL(config)
  }

  _requestMethodWithoutData(method: Method, url: string, config: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  _requestMethodWithData(method: Method, url: string, data: any, config: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}
