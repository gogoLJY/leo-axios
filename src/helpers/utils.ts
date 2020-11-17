import { type } from 'os'

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
