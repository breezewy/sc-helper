import request from '@/utils/request'


//添加景区
export function appendPark(data) {
    return request({
        url: '/park/add',
        method: 'post',
        data
    })
} 

//修改景区
export function updatePark(data) {
    return request({
        url: '/park',
        method: 'put',
        data
    })
}

//删除景区
export function deletePark(data) {
    return request({
        url: '/park',
        method: 'delete',
        data
    })
}



