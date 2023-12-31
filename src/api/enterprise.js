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

export function getEnterpriseDetailAPI(id) {
  return request({
    url: `park/enterprise/${id}`,
    method: 'GET'
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

/**
 * 获取行业列表
 * @returns
 */
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 上传合同
 * @returns
 * type 上传类型
 * 1、企业营业执照businessLicense 2、租赁合同附件contract
 */
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}

/**
 * 获取楼宇列表
 * @param {*} id
 * @returns
 */
export function getRentBuildListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 创建合同
 * @returns
 * @param data
 */
export function createRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 获取合同列表
 * @param {*} id
 * @returns
 */
export function getRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}

/**
 * 获取详情
 * @param {string | (string | null)[]} id
 * @returns
 */

export function getEnterpriseDetail(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'GET'
  })
}

/**
 * 退租
 * @returns
 * @param id
 */

export function outRentAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'PUT'
  })
}

export function deleteRentAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'DELETE'
  })
}
