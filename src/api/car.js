/*
  封装和车有关的接口
*/

// 月卡列表 接口请求
import request from '@/utils/request'

/*
  接口文档中
  如果是 body 参数(属于请求体参数) =》 代码中通过 data 携带
  如果是 query 参数(属于查询参数) =》 代码中通过 params 携带

  params: {
    Query 参数
    page: 1, // 页码(必选)
    pageSize: 10 // 每页条数(必选)
    // 以及还有 3 个可选参数
    carNumber: string, // 车牌号
    personName: string, // 车主姓名
    cardStatus: integer 0:可用 1:已过期

    Header 参数
    Authorization: Bearer token
  }

  /parking/card/list
*/

export function getMonthCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'GET',
    params: params
    // 拦截器里添加比较省事
    // headers: {
    //   Authorization: 'Bearer ' + localStorage.getItem('token')
    // }
  })
}

/**
 * 新增月卡
 * @data
 * @returns
 */
export function createCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}

export function deleteCardAPI(id) {
  return request({
    url: `parking/card/${id}`,
    method: 'DELETE'
  })
}

export function getCardDetailAPI(id) {
  return request({
    url: `parking/card/detail/${id}`,
    method: 'GET'
  })
}

export function updateCardAPI(obj) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data: obj
  })
}
