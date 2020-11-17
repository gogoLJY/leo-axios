import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, rejecct) => {
    const { url, method = 'get', data = null, headers = {}, responseType } = config

    let xhr = new XMLHttpRequest()

    if (responseType) {
      xhr.responseType = responseType
    }

    xhr.open(method.toUpperCase(), url, true)

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) {
        return
      }

      const responseHeader = parseHeaders(xhr.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? xhr.response : xhr.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeader,
        config,
        request: xhr
      }

      resolve(response)
    }

    Object.keys(headers).forEach(key => {
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        xhr.setRequestHeader(key, headers[key])
      }
    })

    xhr.send(data)
  })
}
