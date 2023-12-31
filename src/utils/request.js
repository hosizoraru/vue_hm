import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout ms
})

// 请求拦截器 统一添加请求头
service.interceptors.request.use(
  config => {
    // 添加 token
    config.headers.Authorization =
      'Bearer ' + localStorage.getItem('token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 数据剥离 res.data.data.xx -> res.data.xx
    return response.data
  },
  // 响应失败的拦截器 需要判断响应状态码
  error => {
    // console.dir(error)
    if (error.response.status === 401) {
      // window.location.href = '/login'
      router.push('/login').then(
        () => {
          Message.error('登录状态失效，请重新登录')
        }
      )
    }
    return Promise.reject(error)
  }
)

// 导出 axios 实例
export default service

// service({
//   url: '/park/login',
//   method: 'POST',
//   data: {
//     username: 'admin',
//     password: 'admin123'
//   }
// }).then(
//   (res) => {
//     console.log(res.data.token)
//   }
// )
