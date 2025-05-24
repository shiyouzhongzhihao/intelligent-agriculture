<template>
  <div class="card">
    <el-row>
      <el-col :span="24">
        <el-button v-if="globalStore.loginClassify === 'employee'" size="small" plain type="primary" style="margin-top: 5px">员工端</el-button>
        <el-button v-if="globalStore.loginClassify === 'manager'" size="small" plain type="danger" style="margin-top: 5px">管理端</el-button>
      </el-col>
    </el-row>
    <el-row style="height:50px;margin-top: 10px">
      <el-col :span="24">
        <div class="card-top">
          <span class="login">登录</span>
          <span v-if="globalStore.loginClassify === 'employee'" class="register primary pointer" @click="goRegister">注册</span>
          <span v-if="globalStore.loginClassify === 'manager'" class="register danger pointer" @click="goRegister">注册</span>
        </div>
      </el-col>
    </el-row>
    <el-form>
      <el-form-item>
        <el-input
          v-model="info.username"
          style="width: 100%"
          placeholder="请输入用户名"
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="info.password"
          style="width: 100%"
          placeholder="请输入密码"
          type="password"
          :prefix-icon="Lock"
        />
      </el-form-item>
    </el-form>
    <el-button v-if="globalStore.loginClassify === 'employee'" @click="loginEmployee" style="width: 100%" type="primary">登录</el-button>
    <el-button v-if="globalStore.loginClassify === 'manager'" @click="loginManager" style="width: 100%" type="danger">登录</el-button>
    <el-row class="card-bottom">
      <el-col :span="12">
        <span v-if="globalStore.loginClassify === 'employee'" class="primary default-font-size pointer" @click="goManager">切换为管理端</span>
        <span v-if="globalStore.loginClassify === 'manager'" class="danger default-font-size pointer" @click="goEmployee">切换为员工端</span>
      </el-col>
      <el-col :span="12" class="location-right">
        <span v-if="globalStore.loginClassify === 'employee'" class="primary default-font-size pointer"></span>
        <span v-if="globalStore.loginClassify === 'manager'" class="danger default-font-size pointer"></span>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import router from '@/router'
import { globalSideStore } from '@/store/global-data'
import { onMounted, ref } from 'vue'
import { messageClassifyEnums } from '@/enums'
import { ElMessage } from 'element-plus'
import { userType } from '@/type'
// 公共仓库
const globalStore = globalSideStore()
// 登录信息
const info = ref<userType>({
  username: '',
  password: ''
})
/**
 * 去往员工端
 */
const goEmployee = () => {
  globalStore.setLoginClassify('employee')
}
/**
 * 去往管理端
 */
const goManager = () => {
  globalStore.setLoginClassify('manager')
}
/**
 * 去往注册
 */
const goRegister = () => {
  globalStore.setLoginClassify('register')
}
const loginValidate = (list:userType[]) => {
  // 检查是否存在用户名
  const user = list.find(u => u.username === info.value.username)
  if (!user) {
    // 用户名不存在
    ElMessage({
      message: '用户名不存在',
      type: 'warning'
    })
    return false
  }
  // 检查密码是否正确
  if (user.password !== info.value.password) {
    // 密码错误
    ElMessage({
      message: '密码错误',
      type: 'error'
    })
    return false
  }
  return true
}
/**
 * 员工登录
 */
const loginEmployee = () => {
  // 判断用户名密码的指标-表单检验
  const loginIndex = loginValidate(globalStore.employeeInfoList)
  // 验证成功后提取员工信息细节
  const loginDetail = globalStore.employeeInfoList.find(item => item.username === info.value.username)
  if (loginIndex && loginDetail) {
    // 保存员工细节到库
    globalStore.setEmployee(loginDetail)
    // 设置登录的形式为员工
    globalStore.setLoginClassify('employee')
    // 正在登录，用于生成成功界面
    globalStore.setIsLogin(true)
    setTimeout(() => {
      // 清除状态，页面跳转员工
      globalStore.setIsLogin(false)
      router.push('/employeePage')
    }, 1000)
  }
}
/**
 * 管理登录
 */
const loginManager = () => {
  // 判断用户名密码的指标-表单检验
  const loginIndex = loginValidate(globalStore.managerInfoList)
  // 验证成功后提取管理信息细节
  const loginDetail = globalStore.managerInfoList.find(item => item.username === info.value.username)
  if (loginIndex && loginDetail) {
    // 保存管理细节到库
    globalStore.setManager(loginDetail)
    // 设置登录的形式为管理
    globalStore.setLoginClassify('manager')
    // 正在登录，用于生成成功界面
    globalStore.setIsLogin(true)
    setTimeout(() => {
      // 清除状态，页面跳转管理
      globalStore.setIsLogin(false)
      router.push('/managerPage')
    }, 1000)
  }
}
onMounted(() => {
  if (globalStore.messageClassify === messageClassifyEnums.register) {
    ElMessage({
      message: '注册成功',
      type: 'success'
    })
    // 用完记得置空
    globalStore.setMessageClassify('')
  }
})
</script>

<style scoped lang="scss">
.card {
  padding: 45px 35px;
  background-color: white;
  box-sizing: border-box;
  width: 370px;
  height: 400px;
  border-radius: 0 4px 4px 0;
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .login {
      font-size: 24px;
      font-weight: bold;
      line-height: 40px;
      color: #404040;
    }
    .register {
      font-size: 14px;
    }
  }
  .card-bottom {
    margin-top: 10px;
  }
}
</style>
