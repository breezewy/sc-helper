import request from '@/utils/request'


//获取景区列表
export function getSeatList() {
    return request({
        url: '/seat/list',
        method: 'post'
    })
}

//新增景区
export function appendSeat(data) {
    return request({
        url: '/seat/add',
        method: 'post',
        data
    })
} 

//根据ID获取席位
export function getSeatById(id) {
    return request({
        url: `/seat/${id}`,
        method:'get'
    })
}

//修改席位 
export function updateSeat(data) {
    return request({
        url: '/seat',
        method: 'put',
        data
    })
}

//删除席位
export function deleteSeat(data) {
    return request({
        url: '/seat',
        method: 'delete',
        data
    })
}

//查询席位
export function searchSeat(data) {
    return request({
        url: '/seat/listAll',
        method: 'post',
        data
    })
}