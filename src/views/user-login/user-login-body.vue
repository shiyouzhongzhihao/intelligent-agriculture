<template>
  <div class="body">
    <div class="content">
      <div class="background" :class="{ 'special-height': globalStore.loginClassify === 'register' }">
        <div style="color: #404040;font-size: 22px;margin-top: 80px;z-index: 100">只需一个管理系统账号</div>
        <div style="color: #404040;font-size: 15px;z-index: 100">即可实时掌握环境数据动态</div>
        <img src="@/assets/pic.png" alt="" style="margin-top: -70px;margin-left: 50px;width: 300px;opacity: 50%">
      </div>
      <user-login-body-login v-if="globalStore.loginClassify !== 'register' && !globalStore.isLogin"></user-login-body-login>
      <user-login-body-register v-if="globalStore.loginClassify === 'register' &&!globalStore.isRegister"></user-login-body-register>
      <user-login-body-result v-if="globalStore.isLogin"></user-login-body-result>
      <user-login-body-register-result v-if="globalStore.isRegister"></user-login-body-register-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserLoginBodyLogin from '@/views/user-login/user-login-body-login.vue'
import UserLoginBodyRegister from '@/views/user-login/user-login-body-register.vue'
import { globalSideStore } from '@/store/global-data'
import UserLoginBodyResult from '@/views/user-login/user-login-body-result.vue'
import UserLoginBodyRegisterResult from '@/views/user-login/user-login-body-register-result.vue'

// 公共仓库
const globalStore = globalSideStore()
</script>

<style scoped lang="scss">
:global(html), :global(body) {
  height: 100%;
  margin: 0;
}
.body {
  height: 94vh;
  background-color: hsl(204, 24%, 95%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -15px;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    .background {
      padding: 45px 35px;
      background-color: #EAEDF1;
      box-sizing: border-box;
      width: 370px;
      height: 400px;
      border-radius: 4px 0 0 4px;
    }
    .special-height {
      height: 480px;
    }
  }
}
</style>
