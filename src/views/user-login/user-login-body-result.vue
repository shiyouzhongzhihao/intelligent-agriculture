<template>
  <div class="card">
    <el-result
      icon="success"
      title="登录成功"
      sub-title="即将进入智能环境管理系统"
    >
    </el-result>
    <div style="display: flex;justify-content: center;">
      <div class="demo-progress" style="width: 60%;">
        <el-progress :percentage="percentage" :color="customColor" :show-text="false"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const percentage = ref(0)
const customColor = ref('#409eff')

// 进度增加的步长
const step = 100 / (1000 / 100) // 500 毫秒内达到 100，50 毫秒一个步长

// 开始进度条动画
const progressInterval = setInterval(() => {
  if (percentage.value < 100) {
    percentage.value += step
  } else {
    clearInterval(progressInterval) // 达到 100 时停止定时器
  }
}, 50) // 每 50 毫秒增加一次进度

</script>

<style scoped lang="scss">
.card {
  padding: 45px 35px;
  background-color: white;
  box-sizing: border-box;
  width: 370px;
  height: 400px;
  border-radius: 0 4px 4px 0;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
