
import request from '@/utils/request'

// 获取节目列表
export function getProgramList() {
  return request({
    url: '/guidance/list',
    method: 'post'
  })
}

// 新增节目
export function addProgram(data) {
  return request({
    url: '/guidance/add',
    method: 'post',
    data
  })
}

// 删除节目
export function deleteProgram(id) {
  return request({
    url: `/guidance/del/${id}`,
    method: 'delete'
  })
}

// 获取节目信息
export function getProgramInfo(id) {
  return request({
    url: `/guidance/get/${id}`,
    method: 'get'
  })
}

// 修改节目
export function updateProgram(data) {
  return request({
    url: '/guidance/update',
    method: 'put',
    data
  })
}

