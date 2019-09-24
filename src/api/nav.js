import request from '@/utils/request'


export function getNavList() {
    return request({
        url: '/menu/nav',
        method: 'get'
    })
}