<template>
  <div>
    <div class="body">
      <el-scrollbar height="300px">
        <el-card v-for="item in 5" :key="item" style="margin: 5px 0 " shadow="hover">
          <div style="display: flex;justify-content: space-between;">
            <div>
              <div>邮件名：<el-tag type="success">已读</el-tag></div>
              <div style="font-size: 12px;color: #606266">发件人：</div>
              <div style="font-size: 12px;color: #606266">时间：</div>
            </div>
            <div>
              <el-button type="primary">查看邮件</el-button>
            </div>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>

<style scoped lang="scss">
.body {
  padding: 10px;
  border: 1px solid var(--el-border-color);
  height: 300px;
}
</style>
