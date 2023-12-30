/*
    企业相关函数
 */

import request from '@/utils/request'

export function getEnterpriseListAPI(params) {
  return request({
    url: 'park/enterprise',
    method: 'GET',
    params
  })
}

export function createEnterpriseAPI(data) {
  return request({
    url: 'park/enterprise',
    method: 'POST',
    data
  })
}

export function updateEnterpriseAPI(data) {
  return request({
    url: 'park/enterprise',
    method: 'PUT',
    data
  })
}

export function deleteEnterpriseAPI(id) {
  return request({
    url: `park/enterprise/${id}`,
    method: 'DELETE'
  })
}
