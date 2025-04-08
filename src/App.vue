<template>
  <!--  <el-button @click="get"></el-button>-->
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { getRequest } from '@/services/api'

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
</script>

<style>

</style>
