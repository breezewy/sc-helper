import request from '@/utils/request'


//添加景区
export function appendPark(data) {
    return request({
        url: '/park/add',
        method: 'post',
        data
    })
} 

