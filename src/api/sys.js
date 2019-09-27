

import request from '@/utils/request'


export function getUserList(data) {
    return request({
        url: '/user/list',
        method: 'post',
        data
    })
}

export function getRole() {
    return request({
        url: '/role',
        method: 'get'
    })
}