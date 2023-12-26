// import axios from 'axios'
//
// const axios2 = axios.create({
//   baseURL: 'https://api-hmzs.itheima.net/v1',
//   timeout: 3000 // ms
// })
// // axios.defaults.baseURL = 'https://api-hmzs.itheima.net/v1'
// // axios.defaults.timeout = 3000 // ms
//
// // 添加请求拦截器
// axios2.interceptors.request.use(function(config) {
//   // 在发送请求之前做些什么
//   // 一般会在这里统一添加token 后端接口通过token知道你是谁
//   return config
// }, function(error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// })
//
// // 添加响应拦截器
// axios2.interceptors.response.use(function(response) {
//   // 2xx 范围内的状态码都会触发该函数。
//   // 对响应数据做点什么
//   // 数据剥离 相应的数据去掉一层data,理论也可以多层
//   return response.data
// }, function(error) {
//   // 超出 2xx 范围的状态码都会触发该函数。
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })
//
// // console.log(axios)
// // await axios()
// // 接口请求方式 GET POST PATCH PUT DELETE
// axios2(
//   {
//     url: '/park/login',
//     method: 'POST',
//     data: {
//       username: 'admin',
//       password: 'admin123'
//     }
//   }
// ).then(
//   // () => {}
//   // function(res) {
//   //   console.log(res.data.data.token)
//   // }
//   (res) => {
//     // console.log(res)
//     // console.log(res.data.data.token) // 用户信息token
//     console.log(res.data.token) // 加了拦截器后
//   }
// )

import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'

import store from './store'

import router from './router'

// 注册svg
import '@/icons'

Vue.use(ElementUI)

Vue.config.productionTip = false

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// import { loginAPI } from '@/api/user'
// loginAPI({
//   username: 'admin',
//   password: 'admin123'
// }).then(res => console.log(res.data.token))
