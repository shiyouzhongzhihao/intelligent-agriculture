<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-header>
          <page-header
            title="环境管理系统 - 管理端"
            type="manager"
          />
        </el-header>
        <el-container>
          <el-main>
            <manager-table></manager-table>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import ManagerTable from '@/views/manager-page/manager-table.vue'
import PageHeader from '@/components/page-header.vue'

</script>

<style scoped lang="scss">
</style>
