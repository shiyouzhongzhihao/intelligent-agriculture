import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userType } from '@/type'

// 设置仓库名 global-side-data
export const globalSideStore = defineStore('global-data', () => {
  // 消息类型
  const messageClassify = ref<string>('')
  // 登录方式
  const loginClassify = ref<string>('employee')
  // 是否登录中
  const isLogin = ref<boolean>(false)
  // 是否注册中
  const isRegister = ref<boolean>(false)
  // 信息数组-员工端
  const employeeInfoList = ref<userType[]>([])
  // 信息数组-管理端
  const managerInfoList = ref<userType[]>([])
  // 当前登录员工
  const currentEmployee = ref<userType>()
  // 当前登录管理
  const currentManager = ref<userType>()
  // 验证码临时存放
  const code = ref<number>()
  /**
   * 设置消息类型
   * @param classify 类型 add delete
   */
  const setMessageClassify = (classify: string) => {
    messageClassify.value = classify
  }
  /**
   * 设置登录方式-用于判断登录页面的登录/注册状态
   * @param classify
   */
  const setLoginClassify = (classify: string) => {
    loginClassify.value = classify
  }
  /**
   * 设置登录中-用于判断登录结果页的出现
   * @param newIsLogin
   */
  const setIsLogin = (newIsLogin: boolean) => {
    isLogin.value = newIsLogin
  }
  /**
   * 设置注册中-用于判断登录结果页的出现
   * @param
   */
  const setIsRegister = (newIsRegister: boolean) => {
    isRegister.value = newIsRegister
  }
  /**
   * 新增员工端数据
   */
  const addEmployeeInfo = (newEmployee:userType) => {
    employeeInfoList.value.push(newEmployee)
    window.location.reload() // 刷新当前页面
  }
  /**
   * 新增管理端数据
   */
  const addManagerInfo = (newEmployee:userType) => {
    managerInfoList.value.push(newEmployee)
    // window.location.reload() // 刷新当前页面
  }
  /**
   * 设置当前页面员工
   */
  const setEmployee = (newEmployee:userType) => {
    currentEmployee.value = newEmployee
  }
  /**
   * 设置当前页面管理
   */
  const setManager = (newEmployee:userType) => {
    currentManager.value = newEmployee
  }
  /**
   * 设置验证码
   */
  const setCode = (newCode:number) => {
    code.value = newCode
  }
  // 返回值
  return {
    messageClassify,
    setMessageClassify,
    loginClassify,
    setLoginClassify,
    isLogin,
    setIsLogin,
    isRegister,
    setIsRegister,
    employeeInfoList,
    addEmployeeInfo,
    managerInfoList,
    addManagerInfo,
    currentEmployee,
    currentManager,
    setEmployee,
    setManager,
    code,
    setCode
  }
}, {
// 持久化设置
  persist: true
})
