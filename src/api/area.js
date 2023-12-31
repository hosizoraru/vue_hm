/*
    车行管理-区域管理相关的 API
 */

import request from '@/utils/request'

export function getAreaListAPI(params) {
  return request({
    url: '/parking/area/list',
    method: 'get',
    params
  })
}

export function getAreaDropListAPI() {
  return request({
    url: '/parking/area/dropList',
    method: 'get'
  })
}

export function createAreaAPI(data) {
  return request({
    url: '/parking/area',
    method: 'post',
    data
  })
}

export function updateAreaAPI(data) {
  return request({
    url: '/parking/area',
    method: 'put',
    data
  })
}

export function deleteAreaAPI(id) {
  return request({
    url: '/parking/area/' + id,
    method: 'delete'
  })
}
