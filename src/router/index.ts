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

export default router
