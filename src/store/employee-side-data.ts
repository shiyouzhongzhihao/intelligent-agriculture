import { defineStore } from 'pinia'
import { ref } from 'vue'
import { employeeListType, searchType } from '@/type'
import updateData from '@/utils/updateData'

// 设置仓库名 employee-side-data
export const employeeSideStore = defineStore('employee-side-data', () => {
  // 审批日志数组
  const employeeList = ref<employeeListType[]>([])
  // 激发菜单栏
  const menuId = ref<string>('1')
  /**
   * 新增审批日志
   * @param newEmployee
   */
  const addEmployeeList = async (newEmployee: employeeListType) => {
    employeeList.value.unshift(newEmployee)
    await updateData(employeeList.value)
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
   * 查询审批日志
   * @param employeeToSearch
   */
  const searchEmployeeList = (employeeToSearch: searchType) => {
    // 如果搜索条件为空，返回空数组或全部数据（根据需求调整）
    let result: employeeListType[]
    // 过滤逻辑（不区分大小写 + 部分匹配）
    result = employeeList.value.filter((employee) =>
      employee.diaryId.toLowerCase().includes(employeeToSearch.diaryId.toLowerCase())
    )
    result = result.filter((employee) =>
      employee.staffId?.toLowerCase().includes(employeeToSearch.staffId.toLowerCase())
    )
    result = result.filter((employee) =>
      employee.diaryClassify.toLowerCase().includes(employeeToSearch.diaryClassify.toLowerCase())
    )
    result = result.filter((employee) =>
      employee.state.toLowerCase().includes(employeeToSearch.state.toLowerCase())
    )
    return result
  }
  /**
   * 查看选中详情
   * @param diaryToken 日志唯一标识id
   */
  const viewEmployeeDetail = (diaryToken: string) => {
    return employeeList.value.find(employee => employee.diaryToken === diaryToken)
  }
  /**
   * 选中新菜单栏
   */
  const chooseMenu = (newMenuId: string) => {
    menuId.value = newMenuId
  }
  // 返回值
  return {
    employeeList,
    menuId,
    addEmployeeList,
    deleteEmployeeList,
    searchEmployeeList,
    viewEmployeeDetail,
    chooseMenu
  }
}, {
// 持久化设置
  persist: true
})
