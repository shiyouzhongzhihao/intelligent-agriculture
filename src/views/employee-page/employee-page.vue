<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-header>
          <employee-header/>
        </el-header>
        <el-container>
          <el-aside width="180px">
            <employee-menu/>
          </el-aside>
          <el-main>
            <div v-if="employeeStore.menuId === '3'">
              <env-data/>
              <employee-search  ref="employeeSearchRef" @search="search"/>
              <employee-table :result="result" :isSearch="isSearch"/>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmployeeTable from '@/views/employee-page/employee-table.vue'
import EnvData from '@/views/employee-page/env-data.vue'
import EmployeeSearch from '@/views/employee-page/employee-search.vue'
import EmployeeMenu from '@/views/employee-page/employee-menu.vue'
import { employeeSideStore } from '@/store/employee-side-data'
import EmployeeHeader from '@/views/employee-page/employee-header.vue'

const result = ref()
const employeeSearchRef = ref()
// 员工端数据仓库
const employeeStore = employeeSideStore()
const search = () => {
  result.value = employeeSearchRef.value.result
}
</script>

<style scoped lang="scss">

</style>
