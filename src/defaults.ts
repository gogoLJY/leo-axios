import { AxiosRequestConfig } from './types'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

// 定义默认行为
const defaultConfig: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)

      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ],
  validateStatus(status) {
    return status >= 200 && status < 300
  }
}

const methodsNoData = ['get', 'head', 'options']
const methodsWithData = ['post', 'put', 'patch']

methodsNoData.forEach(method => {
  defaultConfig.headers[method] = {}
})

methodsWithData.forEach(method => {
  defaultConfig.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencodeed'
  }
})

export default defaultConfig
