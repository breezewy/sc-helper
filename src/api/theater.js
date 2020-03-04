import request from '@/utils/request'

// 获取剧院列表
export function getTheaterList() {
  return request({
    url: '/theater/list',
    method: 'post'
  })
}

// 新增剧院
export function appendTheater(data) {
  return request({
    url: '/theater/add',
    method: 'post',
    data
  })
}

// 修改剧院
export function updateTheater(data) {
  return request({
    url: '/theater',
    method: 'put',
    data
  })
}

// 根据ID获取剧院信息
export function getTheaterById(id) {
  return request({
    url: `/theater/${id}`,
    method: 'get'
  })
}

// 根据景区ID获取剧院信息
export function getTheaterByParkId(id) {
  return request({
    url: `/theater/listAllByParkId/${id}`,
    method: 'get'
  })
}

// 删除剧院
export function deleteTheater(data) {
  return request({
    url: '/theater',
    method: 'delete',
    data
  })
}

// 查询剧院
export function searchTheater(data) {
  return request({
    url: '/theater/listAll',
    method: 'post',
    data
  })
}
