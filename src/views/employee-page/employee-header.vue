<template>
  <el-page-header @back="onBack" icon="" title="环境管理系统 - 员工端">
    <template #content>
      <div class="flex items-center">
        <el-avatar
          class="mr-3"
          :size="32"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <span class="text-large font-600 mr-3"> 姓名： </span>
        <span
          class="text-sm mr-2"
          style="color: var(--el-text-color-regular)"
        >
          何宝荣
        </span>
        <el-tag>员工部</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import { ElNotification as notify } from 'element-plus'

const onBack = () => {
  notify('您正处于环境管理系统员工端')
}
</script>
