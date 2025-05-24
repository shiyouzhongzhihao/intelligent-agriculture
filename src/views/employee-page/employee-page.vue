<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-header>
          <page-header
            title="环境管理系统 - 员工端"
            type="employee"
          />
        </el-header>
        <el-container>
          <el-aside width="180px">
            <employee-menu/>
          </el-aside>
          <el-main>
            <div v-if="employeeStore.menuId === '1'"  style="margin-top: -20px">
              <home-page></home-page>
            </div>
            <div v-if="employeeStore.menuId === '2'" style="display: flex;margin-top: -12px;margin-left: -10px">
              <env-echarts v-loading="loading"></env-echarts>
              <env-table></env-table>
            </div>
            <div v-if="employeeStore.menuId === '3'">
              <employee-search  ref="employeeSearchRef" @search="search"/>
              <employee-table :result="result" :isSearch="isSearch"/>
            </div>
            <div v-if="employeeStore.menuId === '4'">
              <change-message></change-message>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EmployeeTable from '@/views/employee-page/diary-audit/employee-table.vue'
import EmployeeSearch from '@/views/employee-page/diary-audit/employee-search.vue'
import EmployeeMenu from '@/views/employee-page/employee-menu.vue'
import { employeeSideStore } from '@/store/employee-side-data'
import PageHeader from '@/components/page-header.vue'
import EnvEcharts from '@/views/employee-page/env-monitor/env-echarts.vue'
import EnvTable from '@/views/employee-page/env-monitor/env-table.vue'
import HomePage from '@/views/employee-page/home-page/home-page.vue'
import ChangeMessage from '@/views/change-message/change-message.vue'
import axios from 'axios'

const loading = ref(false)
const result = ref()
const employeeSearchRef = ref()
// 员工端数据仓库
const employeeStore = employeeSideStore()
const search = () => {
  result.value = employeeSearchRef.value.result
}
onMounted(async () => {
  try {
    const res1 = await axios.get('/api/')
    console.log('基础数据:', res1.data.data)
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

<style scoped lang="scss">

</style>
