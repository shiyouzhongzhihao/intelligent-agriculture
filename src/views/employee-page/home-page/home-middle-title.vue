<template>
  <el-row style="margin-top: 10px;margin-bottom: 10px">
    <el-col :span="12">
      <div class="mid-font">
        <span>
          个人信息
        </span>
        <el-icon :size="19" style="margin-left: 3px" color="#409EFF">
          <User></User>
        </el-icon>
      </div>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="11">
      <div class="mid-font">
        <span>
          邮件
        </span>
        <el-icon :size="20" style="margin-left: 3px" color="#409EFF">
          <Message></Message>
        </el-icon>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { User, Message } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.mid-font {
  color: #409EFF;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
</style>
