export const setRandom = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let uniqueId = ''
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    uniqueId += characters[randomIndex]
  }
  return uniqueId
}
// 随机环境数据，记得删除
export const randomEnvData = () => {
  const airWetness = (Math.random() * 100).toFixed(2)
  const envTemperature = (Math.random() * 45).toFixed(2)
  const lightIntensity = (Math.random() * 120000).toFixed(2)

  return { airWetness, envTemperature, lightIntensity }
}
