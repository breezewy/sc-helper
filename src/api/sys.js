
//系统设置
import request from '@/utils/request'


//获取菜单列表(参数id)
export function getMenuListById(id) {
        return request({
            url: `/menu/list/?type=${id}`,
            method:'get'
        })
}
//获取菜单列表
export function getMenuList() {
    return request({
        url: '/menu/list',
        method:'get'
    })
}

//新增菜单
export function appendMenu(data) {
    return request({
        url: '/menu',
        method: 'post',
        data
    })
}

//修改菜单
export function updateMenu(data) {
    return request({
        url: '/menu',
        method: 'put',
        data
    })
}


//获取svg图标(id)列表
export function getIconList() {
    var res = []
    document.querySelectorAll('svg symbol').forEach(item => {
      res.push(item.id)
    })
    return res
}

//获取信息
export function getMenuByID(id) {
    return request({
        url: `/menu/${id}`,
        method:'get'
    })
}

//删除

export function deleteMenu(id) {
    return request({
        url: `/menu/${id}`,
        method:'delete'
    })
}



  

