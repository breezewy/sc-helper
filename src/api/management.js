
import request from '@/utils/request'

// 用户管理接口

// 用户列表
export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

// 角色配置
export function getRole() {
  return request({
    url: '/role',
    method: 'get'
  })
}

// 新增用户
export function addNewUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/user',
    method: 'delete',
    data
  })
}

// 获取用户信息
export function getUserInfo(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

// 修改用户信息
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

// 角色管理接口

// 角色列表
export function getRoleList(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: '/role',
    method: 'delete',
    data
  })
}

// 获取角色信息
export function getRoleInfo(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

// 重置密码
export function resetPassword(id) {
  return request({
    url: `/user/resetPassword/${id}`,
    method: 'get'
  })
}
