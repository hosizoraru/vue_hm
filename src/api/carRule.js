/*
    计费详情接口
 */

import request from '@/utils/request'

/**
 * 获取规则列表
 * @param {{pageSize: number, page: number}} params
 * @returns
 */
export function getRuleListAPI(params) {
  return request({
    url: 'parking/rule/list',
    method: 'GET',
    params
  })
}

export function getRuleDropListAPI() {
  return request({
    url: 'parking/rule/dropList',
    method: 'GET'
  })
}

/**
 * 创建规则
 * @returns
 */
export function createRuleAPI(data) {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}

export function getRuleDetailAPI(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'GET'
  })
}

export function updateRuleAPI(data) {
  return request({
    url: '/parking/rule',
    method: 'PUT',
    data
  })
}

export function deleteRuleAPI(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'DELETE'
  })
}
