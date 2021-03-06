import request from '@/utils/request'

// 独木桥票行
// 新增独木桥票型
export function addDmqTicket(data) {
  return request({
    url: '/reDmqTicket/save',
    method: 'post',
    data
  })
}

// 获取独木桥票型列表
export function getDmqTicketList(data) {
  return request({
    url: '/reDmqTicket/list',
    method: 'post',
    data
  })
}

// 删除独木桥票型
export function deleteDmqTicket(data) {
  return request({
    url: '/reDmqTicket/del',
    method: 'delete',
    data
  })
}

// 获取独木桥票型详情
export function getDmqTicketDetail(id) {
  return request({
    url: `/reDmqTicket/get/${id}`,
    method: 'get'
  })
}

// 修改独木桥票型
export function updateDmqTicket(data) {
  return request({
    url: '/reDmqTicket/update',
    method: 'post',
    data
  })
}

// 修改之前先验证
export function checkOrder(data) {
  return request({
    url: '/reDmqTicket/beforeUpdate',
    method: 'post',
    data
  })
}

// // //   // // // // //

// 后台票行
// 新增后台票型
export function addReTicket(data) {
  return request({
    url: '/reTicket/save',
    method: 'post',
    data
  })
}

// 获取后台票型列表
export function getTicketList(data) {
  return request({
    url: '/reTicket/list',
    method: 'post',
    data
  })
}

// 删除后台票型
export function deleteTicket(data) {
  return request({
    url: '/reTicket/del',
    method: 'delete',
    data
  })
}

// 获取后台票型详情
export function getTicketDetail(id) {
  return request({
    url: `/reTicket/get/${id}`,
    method: 'get'
  })
}

// 价格日历
export function getByCodeTicketCalendar(code) {
  return request({
    url: `/reTicket/getByCodeTicketCalendar/${code}`,
    method: 'get'
  })
}

// 更新库存
export function updateInventory(data) {
  return request({
    url: '/reTicket/syncTicket',
    method: 'post',
    data
  })
}

// 批量修改票型使用日期
export function batchUpdateTicket(data) {
  return request({
    url: '/reTicket/batchUpdateTicket',
    method: 'post',
    data
  })
}
// 修改后台票型
export function updateTicket(data) {
  return request({
    url: '/reTicket/update',
    method: 'post',
    data
  })
}

// // //   // // // // //
// 票型关联
export function getByDmqTicketId(id) {
  return request({
    url: `/reTicket/getByDmqTicketId/${id}`,
    method: 'get'
  })
}

// 删除关联
export function deleteReTicketDmq(data) {
  return request({
    url: '/reTicketDmq/del',
    method: 'delete',
    data
  })
}

// 添加关联
export function addReTicketDmq(data) {
  return request({
    url: '/reTicketDmq/save',
    method: 'post',
    data
  })
}

export function getControlTicketList(data) {
  return request({
    url: '/reTicket/noCheckTicketList',
    method: 'post',
    data
  })
}

// /////////////
// 订单列表
export function getOrderList(data) {
  return request({
    url: '/reOrder/list',
    method: 'post',
    data
  })
}

// 双击订单列表某一行调用
export function getTicket(id) {
  return request({
    url: `/reOrder/getTicket/${id}`,
    method: 'get'
  })
}

// 关联子订单
export function getReChildOrder(data) {
  return request({
    url: '/reChildOrder/getList',
    method: 'post',
    data
  })
}

// 虚拟票导出

export function handleReDmqExport(data) {
  return request({
    url: '/reDmqTicket/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 虚拟订单列表导出

export function handleReOrderExport(data) {
  return request({
    url: '/reOrder/export',
    method: 'post',
    data
  })
}

// 预约订单列表导出
export function handleReChildOrderExport(data) {
  return request({
    url: '/reChildOrder/export',
    method: 'post',
    data
  })
}

// 去预约，显示二维码
export function makeAppointment(id) {
  return request({
    url: `/reOrder/getCode/${id}`,
    method: 'get'
  })
}

export function exportOrderList(data) {
  return request({
    url: '/export/getList',
    method: 'post',
    data
  })
}
