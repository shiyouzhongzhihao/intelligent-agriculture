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
      <el-badge v-if="envBadge > 0" :value="envBadge" style="margin-top: 22px">
        <el-button link></el-button>
      </el-badge>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><Document /></el-icon>
      <span>日志审核</span>
      <el-badge v-if="confirmBadge > 0" :value="confirmBadge" style="margin-top: 22px">
        <el-button link></el-button>
      </el-badge>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><User /></el-icon>
      <span>信息修改</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { House, View, Document, User } from '@element-plus/icons-vue'
import { employeeSideStore } from '@/store/employee-side-data'
import { onMounted, ref } from 'vue'
import { envSideStore } from '@/store/env-side-data'

// 员工端数据仓库
const employeeStore = employeeSideStore()
const envStore = envSideStore()
const select = (key: string) => {
  employeeStore.chooseMenu(key)
}
const envBadge = ref()
const confirmBadge = ref()
onMounted(() => {
  envBadge.value = envStore.envDataList.filter((item: any) =>
    (parseFloat(item.airWetness) < 20 || parseFloat(item.airWetness) > 80) ||
    (parseFloat(item.envTemperature) < 15 || parseFloat(item.envTemperature) > 35) ||
    (parseFloat(item.lightIntensity) < 30)
  ).length
  confirmBadge.value = employeeStore.employeeList.filter(item => item.state === '已审批' && item.process !== '已确认').length
})
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 550px;
}
</style>
