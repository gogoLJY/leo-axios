export type method =
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'DELETE'
  | 'delete'
  | 'HEAD'
  | 'head'
  | 'OPTIONS'
  | 'options'
  | 'PUT'
  | 'put'

export interface AxiosRequestConfig {
  url: string
  method?: string
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any // xhr 实例
}

export interface AxiosPromise extends Promise<AxiosResponse> {}
