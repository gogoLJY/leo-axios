import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isUrlSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/utils'
import Cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      auth,
      onDownloadProgress,
      onUploadProgress,
      validateStatus
    } = config

    let xhr = new XMLHttpRequest()

    xhr.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    xhr.send(data)

    function configureRequest() {
      if (responseType) {
        xhr.responseType = responseType
      }

      if (timeout) {
        xhr.timeout = timeout
      }

      if (withCredentials) {
        xhr.withCredentials = true
      }
    }

    function addEvents() {
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4 || xhr.status === 0) {
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
        // 代码更简洁一些
        handleResponse(response)
      }

      xhr.onerror = function() {
        reject(createError('Network Error', config, null, xhr))
      }

      xhr.ontimeout = function() {
        reject(createError(`Timeout of ${timeout} of exceeded`, config, 'ECONNABORTED', xhr))
      }

      if (onDownloadProgress) {
        xhr.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        xhr.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders() {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isUrlSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = Cookie.read(xsrfCookieName)

        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(key => {
        if (data === null && key.toLowerCase() === 'content-type') {
          delete headers[key]
        } else {
          xhr.setRequestHeader(key, headers[key])
        }
      })
    }

    function processCancel() {
      // 巧妙的利用 promise 异步分离
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          xhr.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse) {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            xhr,
            response
          )
        )
      }
    }
  })
}
