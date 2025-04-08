import { defineStore } from 'pinia'
import { ref } from 'vue'
import { emailType } from '@/type'

// 设置仓库名 email-data
export const emailSideData = defineStore('email-data', () => {
  // 邮件数组
  const emailList = ref<emailType[]>([])
  /**
   * 新增邮箱数据
   * @param newEmail
   */
  const addEmailList = (newEmail:emailType) => {
    emailList.value.unshift(newEmail)
    window.location.reload() // 刷新当前页面
  }
  /**
   * 已读未读逻辑判断
   */
  const setRead = (emailObject:emailType, username:string) => {
    emailObject.sendPerson.forEach(item => {
      if (item.username === username) {
        item.read = true
      }
    })
    emailList.value.forEach((item) => {
      if (item === emailObject) {
        item.sendPerson = emailObject.sendPerson
      }
    })
  }
  // 返回值
  return {
    emailList,
    addEmailList,
    setRead
  }
}, {
// 持久化设置
  persist: true
})
