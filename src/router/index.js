import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)

const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/views/pages/list'),
    component: Layout,

  },
  {
    path: '/pages',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/list',
        component: () => import('@/views/pages/list')
      },
      {
        path: '/listInTo',
        component: () => import('@/views/pages/listInTo')
      },
      {
        path: '/listOut',
        component: () => import('@/views/pages/listOut')
      }, {
        path: '/listReturn',
        component: () => import('@/views/pages/listReturn')
      },
      {
        path: '/alerting',
        component: () => import('@/views/pages/alerting')
      },
      {
        path: '/goodsManage',
        component: () => import('@/views/pages/goodsManage')
      },
      {
        path: '/storeManage',
        component: () => import('@/views/pages/storeManage')
      },
      {
        path: '/userManage',
        component: () => import('@/views/pages/userManage')
      },
      {
        path: '/statisticsInto',
        component: () => import('@/views/pages/statisticsInto')
      },
      {
        path: '/statisticsOut',
        component: () => import('@/views/pages/statisticsOut')
      },
      {
        path: '/statisticsReturn',
        component: () => import('@/views/pages/statisticsReturn')
      }
    ]
  }
]
export { constantRouterMap }
export default new Router({
  routes: constantRouterMap
})
