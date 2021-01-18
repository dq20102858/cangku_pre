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
    component: () => import('@/views/home/list'),
    component: Layout,

  },
  {
    path: '/home',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/list',
        component: () => import('@/views/home/list')
      },
      {
        path: '/listInTo',
        component: () => import('@/views/home/listInTo')
      },
      {
        path: '/listOut',
        component: () => import('@/views/home/listOut')
      }, 
      {
        path: '/alerting',
        component: () => import('@/views/home/alerting')
      },
      {
        path: '/goodsManage',
        component: () => import('@/views/home/goodsManage')
      },
      {
        path: '/storeManage',
        component: () => import('@/views/home/storeManage')
      },
      {
        path: '/userManage',
        component: () => import('@/views/home/userManage')
      },
      {
        path: '/statisticsInto',
        component: () => import('@/views/home/statisticsInto')
      },
      {
        path: '/statisticsOut',
        component: () => import('@/views/home/statisticsOut')
      }
    ]
  }
]
export { constantRouterMap }
export default new Router({
  routes: constantRouterMap
})
