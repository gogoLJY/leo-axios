// 缓存、保持引用，不用每次都要访问原型
const _toString = Object.prototype.toString

export type IType =
  | 'Map'
  | 'Set'
  | 'Array'
  | 'Object'
  | 'Boolean'
  | 'Date'
  | 'Error'
  | 'Number'
  | 'RegExp'
  | 'String'
  | 'Symbol'

export function isType<T extends any>(type: IType) {
  return function(obj: any): obj is T {
    return _toString.call(obj) === `[object ${type}]`
  }
}

export function isUndef(val: any) {
  return val === null || val === undefined
}

export function isDef(val: any) {
  return val !== null && val !== undefined
}

export const isString = isType<any>('String')

export const isDate = isType<Date>('Date')

export const isArray = isType<Array<any>>('Array')

export const isPlainObject = isType<Object>('Object')

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object'
}

export function isFormData(obj: any): obj is FormData {
  return obj && obj instanceof FormData
}

export function isURLSearchParams(obj: any): obj is URLSearchParams {
  return obj && obj instanceof URLSearchParams
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
