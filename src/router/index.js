import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/authority',
    component: Layout,
    redirect: "/authority/user",
    name: "Authority",
    meta: { title: "权限管理", icon: 'lock' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/authority/user'),
        name: 'user',
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        component: () => import('@/views/authority/role'),
        name: 'role',
        meta: { title: '角色管理' }
      }
    ]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: "/sys/menu",
    name: "Sys",
    meta: { title: "系统设置", icon: 'table' },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/sys/menu'),
        name: 'Menu',
        meta: { title: '菜单管理' }
      }
    ]
  },

  {
    path: '/query',
    component: Layout,
    redirect: "/query/show",
    name: "Query",
    meta: { title: "线下信息查询", icon: 'form' },
    children: [
      {
        path: 'show',
        component: () => import('@/views/query/show'),
        name: 'show',
        meta: { title: '线下场次' }
      },
      {
        path: 'order',
        component: () => import('@/views/query/order'),
        name: 'order',
        meta: { title: '订单查询' }
      }
    ]
  },

  {
    path: '/park',
    component: Layout,
    redirect: "/park/parkManagement",
    name: "Park",
    meta: { title: "景区管理", icon: 'form' },
    children: [
      {
        path: 'parkManagement',
        component: () => import('@/views/park/parkManagement'),
        name: 'parkManagement',
        meta: { title: '景区管理' }
      },
      {
        path: 'seatManagement',
        component: () => import('@/views/park/seatManagement'),
        name: 'seatManagement',
        meta: { title: '席位管理' }
      },
      {
        path: 'theaterManagement',
        component: () => import('@/views/park/theaterManagement'),
        name: 'theaterManagement',
        meta: { title: '剧院管理' }
      }
    ]
  },
  

  {
    path: '/reOrder',
    component: Layout,
    redirect: "/reOrder/dmq",
    name: "ReOrder",
    meta: { title: "二次预约", icon: 'example' },
    children: [
      {
        path: 'dmq',
        component: () => import('@/views/reOrder/dmq'),
        name: 'dmq',
        meta: { title: '预约票型映射' }
      },
      {
        path: 'ticket',
        component: () => import('@/views/reOrder/ticket'),
        name: 'ticket',
        meta: { title: 'OTA票型' }
      },
      {
        path: 'orderList',
        component: () => import('@/views/reOrder/orderList'),
        name: 'orderList',
        meta: { title: '订单列表' }
      },
      {
        path: 'childOrderList',
        component: () => import('@/views/reOrder/childOrderList'),
        name: 'childOrderList',
        meta: { title: '子订单列表' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
