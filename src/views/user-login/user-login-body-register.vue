<template>
  <div class="card" v-loading="isGetEmail">
    <el-row style="height:50px;margin-top: 10px">
      <el-col :span="24">
        <div class="card-top">
          <span class="login">注册</span>
          <span class="register success pointer" @click="goLogin">登录</span>
        </div>
      </el-col>
    </el-row>
    <el-form>
      <el-form-item>
        <el-radio-group fill="#67C23A" v-model="radio" class="custom-radio-group">
          <el-radio-button label="员工端" value="employee" />
          <el-radio-button label="管理端" value="manager" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="info.name"
          style="width: 100%"
          placeholder="请输入姓名"
          :prefix-icon="User"
        />
      </el-form-item>
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
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="info.email"
          style="width: 100%"
          placeholder="请输入邮箱"
          :prefix-icon="Message"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.number="info.code"
          style="width: 100%"
          placeholder="请输入验证码"
          :prefix-icon="Bell"
        >
          <template #append>
            <el-button link @click="sendCode" :disabled="!allowEmail" style="padding: 0 10px">
              {{allowEmail? '获取' : `${countdown}s`}}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-button @click="register" style="width: 100%" type="success">注册</el-button>
  </div>
</template>

<script setup lang="ts">
import { Lock, User, Message, Bell } from '@element-plus/icons-vue'
import { globalSideStore } from '@/store/global-data'
import { onMounted, ref, watch } from 'vue'
import { userType } from '@/type'
import emailjs from '@emailjs/browser'
import { ElMessage } from 'element-plus'
import { getTime } from '@/utils/time'
import { emailSideData } from '@/store/email-side-data'

// 初始化EmailJS（推荐在.env中配置）
const initEmailJS = () => {
  emailjs.init('TQISKsx1_2n9rQSH6')
}
// 是否处于获取邮箱状态
const isGetEmail = ref(false)
// 公共仓库
const globalStore = globalSideStore()
// 邮件仓库
const emailStore = emailSideData()
// 员工端管理端选择
const radio = ref('employee')
// 验证码
const code = ref<number>()
// 倒计时
const countdown = ref<number>(10)
// 允许发送email
const allowEmail = ref<boolean>(true)
// 重置定时器需要用到的参数
const timer = ref<number | null>(null)
// 信息
const info = ref<userType>({
  username: '',
  password: '',
  name: '',
  email: '',
  type: '',
  code: null,
  avatar: ''
})
const helloEmail = ref<any>({})
/**
 * 去往登录页面
 */
const goLogin = () => {
  globalStore.setLoginClassify('employee')
}
// 发送验证码函数
const sendCode = async () => {
  if (info.value.name === '') {
    ElMessage({
      message: '请先填写姓名再获取验证码',
      type: 'warning'
    })
    return
  }
  isGetEmail.value = true
  allowEmail.value = false
  code.value = Math.floor(100000 + Math.random() * 900000)
  globalStore.setCode(code.value)
  // console.log(code.value)
  try {
    await emailjs.send(
      'service_supj0pd', // 替换实际服务ID
      'template_th3twys', // 替换实际模板ID
      {
        to_name: info.value.name,
        from_name: '智能环境管理系统开发者',
        to_email: info.value.email,
        message: code.value // 生成6位随机验证码
      }
    )
    isGetEmail.value = false
    ElMessage({
      message: '验证码已发送',
      type: 'success'
    })
  } catch (error) {
    isGetEmail.value = false
    ElMessage({
      message: '发送失败，请稍后重试',
      type: 'error'
    })
    console.error('EmailJS Error:', error)
  }
}
/**
 * 注册
 */
const register = () => {
  const combinedList = [...globalStore.employeeInfoList, ...globalStore.managerInfoList]
  const user = combinedList.find(u => u.username === info.value.username)
  if (user) {
    ElMessage({
      message: '用户名已存在',
      type: 'warning'
    })
    return
  }
  if (info.value.code !== globalStore.code) {
    ElMessage({
      message: '验证码错误',
      type: 'error'
    })
    return
  } else {
    // 防止验证码复用
    globalStore.code = Math.floor(100000 + Math.random() * 900000)
  }
  if (radio.value === 'employee') {
    // 员工端注册
    info.value.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    info.value.type = 'employee'
    globalStore.addEmployeeInfo(info.value)
    globalStore.setIsRegister(true)
    // 发送邮件
    helloEmail.value.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    helloEmail.value.username = '000'
    helloEmail.value.type = 'manager'
    helloEmail.value.name = '环境管理系统团队'
    helloEmail.value.date = getTime()
    helloEmail.value.title = '恭候多时'
    helloEmail.value.text = `亲爱的${info.value.name}，\n\n欢迎使用环境管理系统！我们很高兴您成为我们大家庭的一员，并且感谢您选择我们的服务。\n\n为了帮助您快速开始使用我们的平台，以下是一些有用的信息：\n\n信息修改：\n请点击菜单中的信息修改模块来修改您的账号信息，设置您的个人资料，优化您的体验。\n\n探索我们的功能：\n\n收发邮件：您可以自由使用邮件来与您的同事进行沟通，同时可以向您的项目负责人发送汇报邮件，这会大大提高您的工作效率。\n可视化环境数据展示： 通过图表对当前的环境数据进行展示，可以选择不同的展示图表，以及对危险的数据进行筛选和上报。\n日志审定： 提交日志给您的项目负责人进行裁定，日志的流程会被全程跟踪，透明化展示，同时引入批量上传日志以提高效率。\n\n开始使用：\n现在就开始您的旅程吧。\n\n如果您有任何问题或需要帮助，我们的支持团队随时为您服务。请随时通过以下方式联系我们：\n\n开发者支持邮箱： 179761948@qq.com\n开发者电话： 15983656521\n再次感谢您使用环境管理系统 ，我们期待为您提供卓越的服务体验。\n\n祝您使用愉快！\n\n环境管理系统开发者团队\nzhongzh@ths.com.cn\n\n`
    helloEmail.value.email = 'zhongzh@ths.com.cn'
    helloEmail.value.sendPerson = [{
      code: 327693,
      email: info.value.email,
      name: info.value.name,
      password: info.value.password,
      read: false,
      type: info.value.type,
      username: info.value.username
    }]
    emailStore.addEmailList(helloEmail.value)
  } else if (radio.value === 'manager') {
    // 管理端注册
    info.value.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    info.value.type = 'manager'
    globalStore.addManagerInfo(info.value)
    globalStore.setIsRegister(true)
  }
}
watch(() => allowEmail.value, (newVal) => {
  if (newVal === false) {
    // 清理之前的定时器
    if (timer.value !== null) {
      clearInterval(timer.value)
      timer.value = null
    }
    // 启动新定时器
    timer.value = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        allowEmail.value = true
        countdown.value = 10
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clearInterval(timer.value!)
        timer.value = null
      }
    }, 1000)
  }
})

// 组件挂载时初始化
onMounted(() => {
  code.value = Math.floor(100000 + Math.random() * 900000)
  globalStore.setCode(code.value)
  initEmailJS()
})
</script>

<style scoped lang="scss">
:deep(.custom-radio-group) {
  /* 悬停时文字颜色 */
  .el-radio-button:hover:not(.is-active) .el-radio-button__inner {
    color: #67C23A !important;
  }
}
.card {
  padding: 45px 35px;
  background-color: white;
  box-sizing: border-box;
  width: 370px;
  height: 480px;
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
}
</style>
