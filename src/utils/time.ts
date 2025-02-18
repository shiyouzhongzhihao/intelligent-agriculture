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
