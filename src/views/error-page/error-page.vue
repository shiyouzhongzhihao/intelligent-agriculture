<template>
  <div style="display: flex;justify-content: center;align-items: center;height: 90vh">
    <el-col :sm="12" :lg="6">
      <el-result
        icon="error"
        title="404"
        sub-title="您无权访问，请先登录"
      >
        <template #extra>
          <el-button type="primary" @click="router.push('/')">返回</el-button>
        </template>
      </el-result>
    </el-col>
  </div>
</template>

<script setup lang="ts">

import router from '@/router'
</script>

<style scoped lang="scss">

</style>
