/*
  员工相关的请求模块
 */

import request from '@/utils/request'
// body 参数使用 data 设置
// query 参数使用 params 设置

export function getEmployeeListAPI(params) {
  return request({
    url: 'park/sys/user',
    method: 'GET',
    params
  })
}

export function createEmployeeAPI(data) {
  return request({
    url: 'park/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @returns
 */
export function deleteEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}

export function resetEmployeePasswordAPI(id) {
  return request({
    url: `/park/sys/user/resetPwd`,
    method: 'PUT',
    data: id
  })
}
