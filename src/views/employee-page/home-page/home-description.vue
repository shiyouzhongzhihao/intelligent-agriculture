<template>
  <div>
    <el-descriptions
      direction="vertical"
      border
    >
      <el-descriptions-item
        :rowspan="2"
        :width="140"
        label="照片"
        align="center"
      >
        <el-image
          style="width: 100px; height: 100px"
          :src="globalStore.currentEmployee.avatar"
        />
      </el-descriptions-item>
      <el-descriptions-item label="真实姓名">
        {{globalStore.currentEmployee.name}}
      </el-descriptions-item>
      <el-descriptions-item label="联系方式">
        {{globalStore.currentEmployee.phone || '暂无'}}
      </el-descriptions-item>
      <el-descriptions-item label="用户账号">
        {{globalStore.currentEmployee.username}}
      </el-descriptions-item>
      <el-descriptions-item label="公司职位">
        <el-tag size="small">员工</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        {{globalStore.currentEmployee.email}}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      direction="vertical"
      border
    >
      <el-descriptions-item label="家庭住址">
        {{globalStore.currentEmployee.address || '暂无'}}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { globalSideStore } from '@/store/global-data'

const globalStore = globalSideStore()
</script>

<style lang="scss" scoped>

</style>
