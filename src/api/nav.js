import request from '@/utils/request'


export function getNavList() {
    return request({
        url: '/menu/nav',
        method: 'get'
    })
}


export function getMenuSelect() {
    return request({
        url: '/menu/select',
        method: 'get'
    })
}