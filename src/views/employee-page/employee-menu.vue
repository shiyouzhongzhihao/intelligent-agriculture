<template>
  <el-menu
    :default-active="employeeStore.menuId"
    class="el-menu-vertical-demo"
    @select="select"
  >
    <el-menu-item index="1">
      <el-icon><house /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon><View /></el-icon>
      <span>环境监控</span>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><Document /></el-icon>
      <span>日志审核</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><User /></el-icon>
      <span>信息修改</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { House, View, Document, User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { employeeSideStore } from '@/store/employee-side-data'

// 员工端数据仓库
const employeeStore = employeeSideStore()
const select = (key: string) => {
  employeeStore.chooseMenu(key)
  console.log(employeeStore.menuId)
}
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 500px;
}
</style>
