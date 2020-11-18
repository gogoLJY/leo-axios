import { AxiosTransformer } from './../types'

export default function transform(
  data: any,
  headers: any,
  fns: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) {
    return data
  }
  // 为了统一
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
