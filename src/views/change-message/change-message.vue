<template>
  <div>
    <el-input placeholder="输入头像链接" v-model="avatar" style="width: 400px"></el-input>
    <el-button @click="changeAvatar" style="margin-left: 10px">修改</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { globalSideStore } from '@/store/global-data'

const avatar = ref<string>()
const globalStore = globalSideStore()
const changeAvatar = () => {
  if (globalStore.currentEmployee) {
    globalStore.currentEmployee.avatar = avatar.value
  }
  globalStore.employeeInfoList.forEach((item: any) => {
    if (item.username === globalStore.currentEmployee?.username) {
      item.avatar = avatar.value
    }
  })
  window.location.reload() // 刷新当前页面
}
</script>

<style scoped lang="scss">

</style>
