import request from '@/utils/request'

export function getParkList(params) {
    return request({
        url: '/park/list',
        method: 'post',
        params
    })
}


export function getPerformList(data) {
    return request({
        url: '/performPlan/getPerformPlan',
        method: 'post',
        data
    })
}

export function getOfflineOrderList(data) {
    return request({
        url: '/offline/order',
        method: 'post',
        data
    })
}

export function getOfflineOrderDetail(id, orderId) {
    return request({
        url: `/offline/getOrderDetail/${id}/${orderId}`,
        method: 'get'
    })
}




