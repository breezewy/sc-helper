// 系统设置
import request from '@/utils/request'
// import Cookies from 'js-cookie'
// import qs from 'qs'

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

// 景区二维码
export function QRCode(code) {
  return request({
    url: `/gatherPark/creatQrCode/${code}`,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 修改景区
export function updatePark(data) {
  return request({
    url: '/gatherPark/update',
    method: 'put',
    data
  })
}

// 游客踪迹
// 登记游客列表
export function getVisitorList(data) {
  return request({
    url: '/visitorRecord/list',
    method: 'post',
    data
  })
}

// 下拉框获取景区
export function gatherParkList() {
  return request({
    url: '/gatherPark/listGatherPark',
    method: 'get'
  })
}

// 获取游客踪迹详情
export function getVisitorDetail(id) {
  return request({
    url: `/visitorRecordDetailed/getRecordDetailed/${id}`,
    method: 'get'
  })
}

// 游客踪迹导出
export function handleTouristExport(data) {
  return request({
    url: `/visitorRecord/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
