import request from '@/utils/request'

// 获取模板列表
export function getSmsTemplateList(data) {
  return request({
    url: '/sms/template/list',
    method: 'post',
    data
  })
}

// 新增短信模板
export function addSmsTemplate(data) {
  return request({
    url: '/sms/template/add',
    method: 'post',
    data
  })
}

// 根据ID获取短信模板
export function getSmsTemplateByID(id) {
  return request({
    url: `/sms/template/get/${id}`,
    method: 'get'
  })
}

// 更新短信模板
export function updateSmsTemplate(data) {
  return request({
    url: '/sms/template',
    method: 'put',
    data
  })
}

// 删除短信模板
export function deleteSms(data) {
  return request({
    url: '/sms/template',
    method: 'delete',
    data
  })
}

// 获取短信发送列表
export function getSmsList(data) {
  return request({
    url: '/sms/list',
    method: 'post',
    data
  })
}

// 重新发送短信
export function resendSms(data) {
  return request({
    url: '/sms/resend',
    method: 'post',
    data
  })
}
