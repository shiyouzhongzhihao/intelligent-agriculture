import axios from 'axios'
import { ElMessage } from 'element-plus' // 假设你在用 Element Plus

const updateData = async (employeeList:any) => {
  // 等待函数
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  try {
    // 1. 构造新数据数组（格式需与数据库字段完全一致）
    const newDataArray = employeeList
    // 2. 将数组转为 JSON 字符串，并进行 URL 编码
    const encodedData = encodeURIComponent(JSON.stringify(newDataArray))

    // 4. 发起 GET 请求
    const response = await axios.get('/api/update', {
      params: {
        newData: encodedData
      }
    })
    console.log('更新结果:', response.data)
  } catch (error:any) {
    console.error('更新失败')
    ElMessage({
      message: '更新失败',
      type: 'error'
    })
  }
  try {
    const res1 = await axios.get('/api/')
    console.log('日志列表:', res1.data.data)
  } catch (error:any) {
    // 增强错误处理
    if (error.response) {
      console.error('请求错误:', {
        status: error.response.status,
        data: error.response.data
      })
    } else {
      console.error('网络错误:', error.message)
    }
  }
  // 添加等待（关键修改点）
  await delay(1000) // 等待1秒
}

export default updateData
