import axios from '../../src'

interface ResponseData<T = any> {
  result: T
  code: number
  messsage: string
}

interface User {
  name: string
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user').then(res => {
    return res.data
  }).catch(err => {
    console.error(err)
  })
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.name)
  }
}

test()


axios.defaults.headers.common['test2'] = 123

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
})