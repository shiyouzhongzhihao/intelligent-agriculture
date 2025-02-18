<template>
  <div class="body">
    <el-button type="success" @click="router.push('/employeePage')">员工端</el-button>
    <el-button type="success" @click="router.push('/managerPage')">管理端</el-button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
</script>

<style scoped lang="scss">
:global(html), :global(body) {
  height: 100%;
  margin: 0;
}
.body {
  height: 100vh; /* 使用视口高度填满页面 */
  margin: 0; /* 移除默认边距 */
  background-image: url('@/assets/wallhaven-m3xowk.jpg');
  background-size: cover; /* 背景图像覆盖整个容器 */
  background-position: center; /* 背景图像居中 */
  background-repeat: no-repeat; /* 不重复背景图像 */
}
</style>
