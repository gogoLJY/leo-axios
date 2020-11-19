import axios from '../../src'

axios({
  method: 'post',
  url: '/base/post',
  data: {
    name: 'leogogo',
    age: 24
  },
})

const paramsString = 'name=leogogo&age=24'
const searchParams = new URLSearchParams(paramsString)

axios({
  method: 'post',
  url: '/base/post',
  data: searchParams
}).then(res => {
  console.log('res', res)
})

axios({
  method: 'post',
  url: '/base/post',
  data: searchParams,
  responseType: 'json',
}).then(res => {
  console.log('res', res)
})