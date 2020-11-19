import { isPlainObject, isString } from './utils'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }

  return data
}
// data 不一定是 JSON 字符串
export function transformResponse(data: any) {
  if (isString(data)) {
    try {
      data = JSON.parse(data)
    } catch (error) {
      console.error(error)
    }
  }

  return data
}
