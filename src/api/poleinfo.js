import request from '@/utils/request'

export function getPoleInfoListAPI(params) {
  return request({
    url: '/pole/info/list',
    method: 'GET',
    params
  })
}

export function getRoleInfoDetailAPI(id) {
  return request({
    url: `/pole/info/${id}`,
    method: 'GET'
  })
}

export function createPoleInfoAPI(data) {
  return request({
    url: '/pole/info',
    method: 'POST',
    data
  })
}

export function updatePoleInfoAPI(data) {
  return request({
    url: '/pole/info',
    method: 'PUT',
    data
  })
}

export function deletePoleInfoAPI(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: 'DELETE'
  })
}
