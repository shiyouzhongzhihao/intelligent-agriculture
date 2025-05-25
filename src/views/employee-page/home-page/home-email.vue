<template>
  <div>
    <div class="body">
      <el-scrollbar height="300px">
        <el-card v-for="item in myEmail" :key="item" style="margin: 5px 0 " shadow="hover">
          <div style="display: flex;justify-content: space-between;">
            <div>
              <div class="primary">邮件名：{{item.title}}</div>
              <div style="font-size: 12px;color: #606266">发件人：{{item.name}}</div>
              <div style="font-size: 12px;color: #606266">时间：{{item.date}}</div>
            </div>
            <div>
              <!--              <el-button type="primary" @click="openEmail">查看邮件</el-button>-->
            </div>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <user-email
      v-model="emailDialog"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { emailSideData } from '@/store/email-side-data'
import { globalSideStore } from '@/store/global-data'
import UserEmail from '@/components/user-email.vue'
// 收件箱
const receiveEmailList = ref([])
// 邮件库
const emailStore = emailSideData()
// 公共仓库
const globalStore = globalSideStore()
// 个人收件箱
const myEmail = ref<any>([])
// 备份完整邮件
const noChangeEmails = ref([])
const emailDialog = ref(false)
onMounted(() => {
  // 收件箱
  receiveEmailList.value = emailStore.emailList as any
  receiveEmailList.value.forEach((e:any) => {
    for (let i = 0; i < e.sendPerson.length; i++) {
      if (e.sendPerson[i].username === globalStore.currentEmployee?.username) {
        myEmail.value.push(e)
      }
    }
  })
  noChangeEmails.value = myEmail.value
})
</script>

<style scoped lang="scss">
.body {
  padding: 10px;
  border: 1px solid var(--el-border-color);
  height: 300px;
}
</style>
