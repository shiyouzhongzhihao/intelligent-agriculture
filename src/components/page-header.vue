<template>
  <el-page-header @back="onBack" icon="" :title="props.title">
    <template #content>
      <div class="flex items-center">
        <el-avatar
          class="mr-3"
          :size="32"
          :src="type === 'employee'? globalStore.currentEmployee.avatar : globalStore.currentManager.avatar"
        />
        <span class="text-large font-600 mr-3"> 姓名： </span>
        <span
          class="text-sm mr-2"
          style="color: var(--el-text-color-regular)"
        >
          {{props.type === 'employee'? globalStore.currentEmployee.name : globalStore.currentManager.name}}
        </span>
        <el-button v-if="props.type === 'employee'" type="primary" size="small" plain>员工端</el-button>
        <el-button v-if="props.type === 'manager'" type="danger" size="small" plain>管理端</el-button>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button @click="openEmail" type="success">邮箱</el-button>
        <el-button type="danger" class="ml-2" @click="exit">退出登录</el-button>
      </div>
    </template>
  </el-page-header>
  <user-email
    v-model="emailDialog"
    :type="props.type"
  />
</template>

<script setup lang="ts">
import { ElNotification as notify } from 'element-plus'
import { globalSideStore } from '@/store/global-data'
import { defineProps, ref } from 'vue'
import router from '@/router'
import UserEmail from '@/components/user-email.vue'

const props = defineProps({
  title: {
    type: String
  },
  type: {
    type: String
  }
})
const emailDialog = ref(false)
const openEmail = () => {
  emailDialog.value = true
}
const exit = () => {
  globalStore.setLoginClassify('register')
  router.push('/')
}
// 公共仓库
const globalStore = globalSideStore()
const onBack = () => {
  notify('您正处于环境管理系统员工端')
}
</script>

<style scoped lang="scss">
</style>
