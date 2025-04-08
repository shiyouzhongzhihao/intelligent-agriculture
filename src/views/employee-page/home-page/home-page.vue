<template>
  <div>
    <home-statistic></home-statistic>
    <div>
      <home-middle-title></home-middle-title>
      <el-row>
        <el-col :span="12">
          <home-description></home-description>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="11">
          <home-email></home-email>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">

import HomeStatistic from '@/views/employee-page/home-page/home-statistic.vue'
import HomeDescription from '@/views/employee-page/home-page/home-description.vue'
import HomeEmail from '@/views/employee-page/home-page/home-email.vue'
import HomeMiddleTitle from '@/views/employee-page/home-page/home-middle-title.vue'
</script>

<style scoped lang="scss">

</style>
