<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height:8vh;">
        <user-login-header></user-login-header>
      </el-header>
      <el-main style="padding: 0">
        <user-login-body></user-login-body>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import UserLoginBody from '@/views/user-login/user-login-body.vue'
import UserLoginHeader from '@/views/user-login/user-login-header.vue'
</script>

<style scoped lang="scss">
</style>
