<script setup lang="ts">

import router from '@/router'
</script>

<template>
  <el-button type="success" @click="router.push('/employeePage')">员工端</el-button>
  <el-button type="success" @click="router.push('/managerPage')">管理端</el-button>
</template>

<style scoped lang="scss">

</style>
