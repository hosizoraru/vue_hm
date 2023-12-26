import axios from 'axios'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout ms
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加 token
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
  error => {
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
