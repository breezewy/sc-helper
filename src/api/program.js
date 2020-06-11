
import request from '@/utils/request'

// 获取节目列表
export function getProgramList(data) {
  return request({
    url: '/guidance/list',
    method: 'post',
    data
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

// 获取节目单详情列表
export function getProgramDetailList(id) {
  return request({
    url: `/guidance/detail/listById/${id}`,
    method: 'post'
  })
}

// 新增节目单详情
export function addProgramDetail(data) {
  return request({
    url: `/guidance/detail/add`,
    method: 'post',
    data
  })
}

// 修改节目单详情
export function updateProgramDetail(data) {
  return request({
    url: `/guidance/detail/update`,
    method: 'put',
    data
  })
}

// 删除节目单详情
export function deleteProgramDetail(id) {
  return request({
    url: `/guidance/detail/del${id}`,
    method: 'delete'
  })
}

// 查询节目单详情
export function getGuidanceDetailInfo(id) {
  return request({
    url: `/guidance/detail/get/${id}`,
    method: 'get'
  })
}

