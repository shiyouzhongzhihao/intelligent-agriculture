const currentDate = new Date()
const year = currentDate.getFullYear() // 获取年份
const month = currentDate.getMonth() + 1 // 获取月份（0-11，所以要加1）
const day = currentDate.getDate() // 获取日期
const hours = currentDate.getHours() // 获取小时
const minutes = currentDate.getMinutes() // 获取分钟
const seconds = currentDate.getSeconds() // 获取秒钟

// 使用 padStart 补充零，确保月份、日期、小时、分钟、秒数都是两位数
export const date = year + '-' + month + '-' + day
export const time = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
export const completeTime = date + ' ' + time

// 时间格式化函数（动态生成）
export const getCompleteTime = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0') // 修复：月份也需要补零
  const day = String(currentDate.getDate()).padStart(2, '0')
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  const seconds = String(currentDate.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
// 获取当前日期
export const getTime = () => {
  // 获取当前日期
  const date = new Date()

  // 提取年、月、日
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() 返回的是从 0 开始的月份，所以需要加 1
  const day = date.getDate()

  // 格式化成 "2025年2月23日" 形式
  const formattedDate = `${year}年${month}月${day}日`

  return formattedDate
}
