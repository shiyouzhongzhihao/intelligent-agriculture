import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/user-login/user-login.vue'
import EmployeePage from '@/views/employee-page/employee-page.vue'
import ManagerPage from '@/views/manager-page/manager-page.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/employeePage',
    component: EmployeePage
  },
  {
    path: '/managerPage',
    component: ManagerPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由全局前置守卫
router.beforeEach((to, from, next) => {
  // 假设有一个 `isLoggedIn` 标志，用来表示用户是否已登录
  const globalData = JSON.parse(<string>localStorage.getItem('global-data'))
  console.log(globalData) // 查看整个对象
  // 如果访问的是非登录页面且用户没有登录，重定向到登录页面
  if (to.path !== '/' && globalData.loginClassify === 'register') {
    next('/') // 未登录时，跳转到登录页面
  } else {
    next() // 允许访问目标页面
  }
})
export default router
