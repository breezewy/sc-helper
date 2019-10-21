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
    path: '/sys',
    component: Layout,
    redirect: "/sys/user",
    name: "Sys",
    meta: { title: "权限管理", icon: 'lock' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/sys/user'),
        name: 'user',
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: { title: '角色管理' }
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
        meta: { title: '独木桥票型' }
      },
      {
        path: 'ticket',
        component: () => import('@/views/reOrder/ticket'),
        name: 'ticket',
        meta: { title: '后台票型' }
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
