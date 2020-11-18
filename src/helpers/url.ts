import { isUndef, isArray, isDate, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

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

export function buildUrl(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let parts: string[] = []

  let serializedParams

  let urlArr = url.split('?')
  url = urlArr[0]

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    parts = parseParams(Object.assign({}, getAllUrlParam(urlArr[1]), params))
    serializedParams = parts.join('&')
  }

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

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return { protocol, host }
}

export function isUrlSameOrigin(requestURL: string): boolean {
  // 协议域名端口号
  //
  const parsedOrigin = resolveURL(requestURL)

  return (
    currentOrigin.protocol === parsedOrigin.protocol && currentOrigin.host === parsedOrigin.host
  )
}

export function isAbsoluteUrl(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineUrl(baseUrl: string, relativeUrl?: string) {
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}
