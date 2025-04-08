<template>
  <div class="card">
    <el-result
      icon="success"
      title="注册成功"
      sub-title="新农人认证成功，丰收路上携手同行"
    >
      <template #extra>
        <el-button type="primary" @click="goLogin">返回登录</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { globalSideStore } from '@/store/global-data'

// 公共仓库
const globalStore = globalSideStore()
const goLogin = () => {
  globalStore.setLoginClassify('employee')
  globalStore.setIsRegister(false)
  window.location.reload() // 刷新当前页面
}
</script>

<style scoped lang="scss">
.card {
  display: flex;
  align-items: center;
  padding: 45px 35px;
  background-color: white;
  box-sizing: border-box;
  width: 370px;
  height: 480px;
  border-radius: 0 4px 4px 0;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
