<template>
  <!--  <el-button @click="get"></el-button>-->
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { getRequest } from '@/services/api'
import { onMounted } from 'vue'
import axios from 'axios'

const get = async () => {
  const res = await getRequest({
    lib_version: '4.4.1',
    user_id: 'TQISKsx1_2n9rQSH6',
    service_id: 'service_supj0pd',
    template_id: 'template_th3twys',
    template_params: {
      to_name: '1',
      from_name: '智能环境管理系统开发者',
      to_email: '179761948@qq.com', // 确保这是正确的邮箱地址，或者为空字符串
      message: 999999
    }
  })
  console.log(res)
}
// const ws = new WebSocket('ws://172.20.10.12:3000')
//
// ws.onopen = () => {
//   console.log('已连接到服务器')
//   ws.send('你好，我是客户端')
// }
//
// ws.onmessage = (event) => {
//   console.log('收到服务器消息:', JSON.parse(event.data))
// }
onMounted(async () => {
  // try {
  //   const res1 = await axios.get('/api/')
  //   console.log('基础数据:', res1.data.data)
  //   employeeStore.employeeList = JSON.parse(JSON.stringify(res1.data.data))
  // } catch (error:any) {
  //   // 增强错误处理
  //   if (error.response) {
  //     console.error('请求错误:', {
  //       status: error.response.status,
  //       data: error.response.data
  //     })
  //   } else {
  //     console.error('网络错误:', error.message)
  //   }
  // }
  try {
    const res1 = await axios.get('/api/getEnv')
    console.log('环境数据:', res1.data.data)
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
})
</script>

<style>

</style>
