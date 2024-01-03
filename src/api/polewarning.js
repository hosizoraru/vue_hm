import request from '@/utils/request'

export function getPoleWarningListAPI(params) {
  return request({
    url: '/pole/warning/list',
    method: 'GET',
    params
  })
}

export function getPoleWarningDetailAPI(id) {
  return request({
    url: `/pole/warning/${id}`,
    method: 'GET'
  })
}

export function deletePoleWarningAPI(id) {
  return request({
    url: `/pole/warning/${id}`,
    method: 'DELETE'
  })
}

export function sendPoleWarningAPI(data) {
  return request({
    url: '/pole/warning/send',
    method: 'PUT',
    data
  })
}

export function handlePoleWarningAPI(data) {
  return request({
    url: '/pole/warning/handle',
    method: 'PUT',
    data
  })
}
