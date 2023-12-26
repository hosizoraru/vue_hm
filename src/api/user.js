/*
  用户相关请求模块
  登陆请求 获取用户信息 ...
  export default xx 默认导出 只能有一个
    导入名字随意
    import xx from ''
  export xx 按需导出 可以有多个
    导入名字必须和导出名字一致
    import { xx } from ''
  请求相关函数 建议封装
*/

// then 异步
// loginAPI(
//   { username: 'admin', password: 'admin123' }
// ).then(res => console.log(res))

import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

// updatePasswordAPI({ oldPassword: '123', newPassword: '456' })
export function updatePasswordAPI(data) {
  return request({
    url: '/park/profile/updatePwd',
    method: 'PUT',
    data
  })
}
