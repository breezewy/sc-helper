import request from '@/utils/request'

// 获取景区列表
export function getParkList(data) {
  return request({
    url: '/park/list',
    method: 'post',
    data
  })
}

// 根据ID查询景区
export function getParkById(id) {
  return request({
    url: `/park/${id}`,
    method: 'get'
  })
}

// 获取演出场次
export function getPerformList(data) {
  return request({
    url: '/performPlan/getPerformPlan',
    method: 'post',
    data
  })
}

// 线下订单列表
export function getOfflineOrderList(data) {
  return request({
    url: '/offline/order',
    method: 'post',
    data
  })
}

// 线下订单详情
export function getOfflineOrderDetail(id, orderId) {
  return request({
    url: `/offline/getOrderDetail/${id}/${orderId}`,
    method: 'get'
  })
}

// 座位查询
export function getOfflineOrderSeat(data) {
  return request({
    url: '/offline/getByOrderSeat',
    method: 'post',
    data
  })
}

