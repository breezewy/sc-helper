//小程序 API
import request from '@/utils/request'


//获取小程序景区列表
export function getParkList() {
    return request({
        url: '/teamPark/list',
        method:'get'
    })
}

//新增小程序景区
export function appendPark(data) {
    return request({
        url: '/teamPark/add',
        method: 'post',
        data
    })
}

//根据ID获取景区详情
export function getParkInfo(id) {
    return request({
        url: `/teamPark/${id}`,
        method: 'get'
    })
}

//修改景区
export function updatePark(data) {
    return request({
        url: '/teamPark',
        method: 'put',
        data
    })
}

//删除景区
export function deletePrak(data) {
    return request({
        url: '/teamPark',
        method: 'delete',
        data
    })
}

//获取轮播图列表
export function getRotationList() {
    return request({
        url: '/teamBanner/list',
        method:'get'
    })
}

//添加轮播图
export function appendRotation(data) {
    return request({
        url: '/teamBanner/add',
        method: 'post',
        data
    })
}

//根据ID获取轮播图
export function getRotationInfo(id) {
    return request({
        url: `/teamBanner/${id}`,
        method: 'get'
    })
}

//修改轮播图
export function updateRotation(data) {
    return request({
        url: '/teamBanner',
        method: 'put',
        data
    })
}

//删除轮播图
export function deleteRotation(data) {
    return request({
        url: '/teamBanner',
        method: 'delete',
        data
    })
}