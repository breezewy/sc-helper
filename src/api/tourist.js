// 系统设置
import request from '@/utils/request'

// 登记景区列表
export function getParkList(data) {
  return request({
    url: '/gatherPark/list',
    method: 'post',
    data
  })
}

// 添加登记景区
export function addPark(data) {
  return request({
    url: '/gatherPark/add',
    method: 'post',
    data
  })
}

// 根据ID获取景区信息
export function getParkInfoById(id) {
  return request({
    url: `/gatherPark/${id}`,
    method: 'get'
  })
}

// 修改景区
export function updatePark(data) {
  return request({
    url: '/gatherPark',
    method: 'put',
    data
  })
}

