    
import { constantRouterMap } from '@/router'
import { getNavList } from '@/api/nav'

const permission = {
    state: {
      routers: [],
      addRouters: []
    },
    mutations: {
      SET_ROUTERS: (state, routers) => {
        state.addRouters = routers   //路由访问
        state.routers = constantRouterMap.concat(routers);
      }
    },
    actions: {
      GenerateRoutes({commit}, data) {
        return new Promise(resolve => {
          resolve()
        })
      },
      // 获取系统菜单
      GetMenu({commit}) {
        return new Promise(resolve => {
            getNavList().then((res) => {
            const data = res.data.data
            commit('SET_ROUTERS', data)
            resolve(data)
          })
        })
      }
    }
  }
  
  export default permission