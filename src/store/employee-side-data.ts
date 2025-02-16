import { defineStore } from 'pinia'
import { ref } from 'vue'
import { employeeListType } from '@/type'

// 设置仓库名 employee-side-data
export const employeeSideStore = defineStore('employee-side-data', () => {
  // 审批日志数组
  const employeeList = ref<employeeListType[]>([])
  /**
   * 新增审批日志
   * @param newEmployee
   */
  const addEmployeeList = (newEmployee:employeeListType) => {
    employeeList.value.unshift(newEmployee)
    window.location.reload() // 刷新当前页面
  }
  /**
   * 删除审批日志
   * @param employeeToDelete 要删除的日志对象
   */
  const deleteEmployeeList = (employeeToDelete: employeeListType) => {
    employeeList.value = employeeList.value.filter(employee => {
      // 根据需要的条件判断是否保留该对象
      return employee.diaryToken !== employeeToDelete.diaryToken
    })
    window.location.reload() // 刷新当前页面
  }
  /**
   * 查看选中详情
   * @param diaryToken 日志唯一标识id
   */
  const viewEmployeeDetail = (diaryToken: string) => {
    return employeeList.value.find(employee => employee.diaryToken === diaryToken)
  }
  // 返回值
  return {
    employeeList,
    addEmployeeList,
    deleteEmployeeList,
    viewEmployeeDetail
  }
}, {
// 持久化设置
  persist: true
})
