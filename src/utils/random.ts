export const setRandom = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let uniqueId = ''
  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    uniqueId += characters[randomIndex]
  }
  return uniqueId
}
