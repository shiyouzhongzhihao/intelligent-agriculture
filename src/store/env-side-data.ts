import { defineStore } from 'pinia'
import { ref } from 'vue'
import { envType } from '@/type'

// 设置仓库名 env-side-data
export const envSideStore = defineStore('env-data', () => {
  // 环境数组
  const envDataList = ref<envType[]>([])
  // 当前环境数据分类
  const envClassify = ref<string>('')
  // 当前展示条数
  const envNumber = ref(0)
  // 当前选中的新增日志信息
  const currentAddDiary = ref<envType>()
  /**
   * 新增环境数据
   * @param newEnvData
   */
  const addEnvDataList = (newEnvData:envType) => {
    envDataList.value.unshift(newEnvData)
    window.location.reload() // 刷新当前页面
  }
  /**
   * 设置分类
   */
  const setEnvClassify = (newEnvClassify:string) => {
    envClassify.value = newEnvClassify
    window.location.reload() // 刷新当前页面
  }
  /**
   * 设置条数
   * @param newEnvNumber
   */
  const setEnvNumber = (newEnvNumber:number) => {
    envNumber.value = newEnvNumber
    window.location.reload() // 刷新当前页面
  }
  const setCurrentAddDiary = (newDiary:envType) => {
    currentAddDiary.value = newDiary
  }
  // 返回值
  return {
    envDataList,
    addEnvDataList,
    setEnvClassify,
    envClassify,
    setEnvNumber,
    envNumber,
    setCurrentAddDiary,
    currentAddDiary
  }
}, {
// 持久化设置
  persist: true
})
