
// 系统设置
import request from '@/utils/request'

// 获取菜单列表(参数id)
export function getMenuListById(id) {
  return request({
    url: `/menu/list?type=${id}`,
    method: 'get'
  })
}
// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

// 新增菜单
export function appendMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data
  })
}

// 获取svg图标(id)列表
export function getIconList() {
  var res = []
  document.querySelectorAll('svg symbol').forEach(item => {
    res.push(item.id)
  })
  return res
}

// 获取菜单信息
export function getMenuByID(id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}

// 获取定时任务列表
export function getJobList(data) {
  return request({
    url: '/job/list',
    method: 'post',
    data
  })
}

// 新增定时任务
export function addJob(data) {
  return request({
    url: '/job',
    method: 'post',
    data
  })
}

// 修改定时任务
export function updateJob(data) {
  return request({
    url: '/job',
    method: 'put',
    data
  })
}

// 根据ID获取定时任务信息
export function getJobByID(id) {
  return request({
    url: `/job/${id}`,
    method: 'get'
  })
}

// 删除定时任务
export function deleteJob(data) {
  return request({
    url: '/job',
    method: 'delete',
    data
  })
}

// 暂停定时任务
export function pauseJob(data) {
  return request({
    url: '/job/pause',
    method: 'put',
    data
  })
}

// 恢复定时任务
export function resumeJob(data) {
  return request({
    url: '/job/resume',
    method: 'put',
    data
  })
}

// 立即执行定时任务
export function runJob(data) {
  return request({
    url: '/job/run',
    method: 'put',
    data
  })
}
