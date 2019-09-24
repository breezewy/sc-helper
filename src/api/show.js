import request from '@/utils/request'

export function getParkList(params) {
    return request({
        url: '/park/list',
        method: 'post',
        params
    })
}
