import request from '@/utils/request'

export function getPaymentListAPI(params) {
  return request({
    url: '/parking/payment/list',
    method: 'GET',
    params
  })
}
