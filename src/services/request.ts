import axios from 'axios'
const instance = axios.create({
  // 接口地址
  baseURL: '',
  // 超时时间
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use((config:any) => {
  const token = '111'
  // 如果token存在，我们配置请求头
  if (token) {
    // 等号之后的部分由后端界定
    config.headers.Authorization = token
  }
  // 抛出
  return config
},
// 异常情况
(err:any) => {
  // 抛出
  return Promise.reject(err)
}
)
// 响应拦截器
instance.interceptors.response.use((res:any) => {
  // 正确返回
  if (res.status === 200) {
    // 这个地方我们可以抛出res.data，省一层循环
    return res
  } else {
    // 还是要抛出
    return Promise.reject(res)
  }
},
// 异常情况
(err:any) => {
  return Promise.reject(err)
}
)
// 暴露
export default instance
