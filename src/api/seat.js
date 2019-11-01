import request from '@/utils/request'


//获取景区列表
export function getSeatList() {
    return request({
        url: '/seat/list',
        method: 'post'
    })
}