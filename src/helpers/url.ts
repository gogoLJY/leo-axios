import { isUndef, isArray, isDate, isPlainObject } from './utils'

function encodeUrl(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%24/g, '$')
    .replace(/%20/g, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3A/gi, ':')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function getAllUrlParam(str: string) {
  let obj = {} as any

  if (str) {
    let urlArr = str.split('&')
    for (let i = 0; i < urlArr.length; i++) {
      let arg = urlArr[i].split('=')
      obj[arg[0]] = arg[1]
    }
  }

  return obj
}

function parseParams(params?: any) {
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]

    if (isUndef(val)) {
      return
    }

    let values = []

    if (isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach((v: any) => {
      if (isDate(v)) {
        v = v.toISOString()
      } else if (isPlainObject(v)) {
        v = JSON.stringify(v)
      }

      parts.push(`${encodeUrl(key)}=${encodeUrl(v)}`)
    })
  })

  return parts
}

export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }

  let urlArr = url.split('?')
  url = urlArr[0]

  const parts: string[] = parseParams(Object.assign({}, getAllUrlParam(urlArr[1]), params))

  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 判断 是否带 hash
    const matchIndex = url.indexOf('#')
    if (matchIndex !== -1) {
      url = url.slice(0, matchIndex)
    }

    url += '?' + serializedParams
  }

  return url
}
