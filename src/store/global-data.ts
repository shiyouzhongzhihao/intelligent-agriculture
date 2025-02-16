import { defineStore } from 'pinia'
import { ref } from 'vue'

// 设置仓库名 global-side-data
export const globalSideStore = defineStore('global-data', () => {
  // 消息类型
  const messageClassify = ref<string>('')
  /**
   * 设置消息类型
   * @param classify 类型 add delete
   */
  const setMessageClassify = (classify: string) => {
    messageClassify.value = classify
  }
  // 返回值
  return {
    messageClassify,
    setMessageClassify
  }
}, {
// 持久化设置
  persist: true
})
