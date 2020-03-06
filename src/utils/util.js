import store from '@/store'

import { validatenull } from './validate'

export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return
  }
  const menus = formatRoutes(menu)
  const unfound = {
    path: '*',
    redirect: '/404',
    hidden: true
  }
  menus.push(unfound)
  router.options.routes = menus
  router.addRoutes(menus)
}

export const formatRoutes = (aMenu) => {
  const aRouter = []
  aMenu.forEach(oMenu => {
    const data = {
      path: oMenu.url,
      name: oMenu.url,
      component(resolve) {
        let componentPath = ''
        if (oMenu.pid == 0) {
          require(['@/layout'], resolve)
          return
        } else {
          componentPath = oMenu.url
        }
        require([`@/views/${componentPath}.vue`], resolve)
      },
      meta: {
        title: oMenu.name,
        icon: oMenu.icon.replace('icon-', '')
      },
      children: oMenu.children.length > 0 ? formatRoutes(oMenu.children) : []
    }
    aRouter.push(data)
  })
  return aRouter
}
