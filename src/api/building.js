/*
    封装楼宇相关的接口函数
 */

import request from '@/utils/request'

export function getBuildingListAPI(params) {
  return request({
    url: 'park/building',
    method: 'GET',
    params
  })
}

export function createBuildingAPI(data) {
  return request({
    url: 'park/building',
    method: 'POST',
    data
  })
}

export function deleteBuildingAPI(id) {
  return request({
    url: `park/building/${id}`,
    // url: 'park/building/' + id,
    method: 'DELETE'
  })
}

export function updateBuildingAPI(data) {
  return request({
    url: 'park/building',
    method: 'PUT',
    data
  })
}
