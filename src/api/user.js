import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getCaptcha(id) {
  return request({
    url: `/auth/captcha?uuid=${id}`,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function changePwd(data) {
  return request({
    url: `/user/updatePwd`,
    method: 'put',
    data
  })
}

export function getPermissions() {
  return request({
    url: '/menu/permissions',
    method: 'get'
  })
}
