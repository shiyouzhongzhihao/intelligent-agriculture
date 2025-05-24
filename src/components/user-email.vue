<template>
  <el-dialog
    :show-close="false"
    width="70%"
    style="margin-top: 20px"
    @close="close"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header" style="margin-top: -20px">
        <h4 v-if="!isSend" :id="titleId" :class="titleClass">收件箱</h4>
        <h4 v-else :id="titleId" :class="titleClass">寄件箱</h4>
        <div>
          <el-button v-if="!isSend" type="warning" @click="goSendEmail">
            <el-icon class="el-icon--left"><Refresh /></el-icon>
            寄件箱
          </el-button>
          <el-button v-else type="success" @click="goReceiveEmail">
            <el-icon class="el-icon--left"><Refresh /></el-icon>
            收件箱
          </el-button>
          <el-button v-if="!isSend" type="primary" @click="add">
            <el-icon class="el-icon--left"><CirclePlus /></el-icon>
            新增邮件
          </el-button>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            Close
          </el-button>
        </div>
      </div>
    </template>
    <el-row v-if="!isSend">
      <!--收件箱-->
      <el-col :span="8" style="border: 1px solid var(--el-border-color);">
        <el-table
          :data="myEmail"
          style="width: 100%"
          height="500"
        >
          <el-table-column>
            <template #header>
              <div style="display: flex;justify-content: space-between;">
                <div>收件箱</div>
                <el-input
                  v-model="sendPerson"
                  size="small"
                  placeholder="搜索寄件人"
                  @input="searchSendPerson"
                  style="width: 150px;"
                />
              </div>
            </template>
            <template #default="scope">
              <el-row style="height: 82px" class="pointer" @click="watchEmail(scope.row)">
                <el-col :span="3">
                  <el-avatar
                    :size="38"
                    :src="scope.row.avatar"
                  />
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="20" style="margin-left: -5px">
                  <el-row>
                    <el-col :span="1">
                      <span v-if="scope.row.sendPerson.some((item:any) => {
                        return item.username === globalStore.currentEmployee.username && item.read;
                      })" style="color: #67C23A;font-size: 30px;font-weight: 600;margin-left: -4px">·</span>
                      <span v-else style="color: #F56C6C;font-size: 30px;font-weight: 600;margin-left: -4px">·</span>
                    </el-col>
                    <el-col :span="17">
                      <span style="font-size: 16px;font-weight: 600">
                        {{scope.row.name}}
                      </span>
                      <el-tag v-if="scope.row.type === 'employee'" type="primary" size="small" style="margin-left: 6px;margin-top: -6px">
                        员工
                      </el-tag>
                      <el-tag v-else type="danger" size="small" style="margin-left: 6px;margin-top: -6px">
                        管理
                      </el-tag>
                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="5">
                      <span style="font-size: 12px;color: #909399">
                        {{scope.row.date.slice(5)}}
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span class="out-font" style="margin-top: -5px">
                        {{scope.row.title}}
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span class="out-text" style="margin-top: -7px">
                        {{scope.row.text}}
                      </span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无邮件" />
          </template>
        </el-table>
      </el-col>
      <el-col :span="1"></el-col>
      <!--  新建邮件    -->
      <el-col v-if="!isWatchEmail" :span="15" style="border: 1px solid var(--el-border-color);">
        <!--顶部-->
        <div class="add-top">
          <div>新建邮件</div>
          <div style="display: flex;align-items: center;">
            <el-button v-if="addPersonGroup.length <1" type="info" size="small" link @click="openAddContactDialog">
              <el-icon>
                <Plus></Plus>
              </el-icon>
              添加收信人
            </el-button>
            <el-button v-if="addPersonGroup.length > 0" type="info" size="small" link @click="openAddContactDialog">
              <el-icon>
                <Edit></Edit>
              </el-icon>
              编辑收信人
            </el-button>
            <div style="display: flex;max-width: 350px;height:27px;flex-wrap: wrap;overflow-y: auto">
              <div class="add-person" v-for="item in addPersonGroup" :key="item.id">
                <el-avatar
                  :size="25"
                  shape="square"
                  :src="item.avatar"
                />
                <div style="margin-right: 3px;margin-left: 3px">{{item.name}}</div>
              </div>
            </div>
            <el-button type="success" @click="sendEmail">
              <el-icon style="margin-right: 2px" :size="16">
                <Promotion></Promotion>
              </el-icon>
              发送
            </el-button>
          </div>
        </div>
        <!--标题-->
        <div class="top-title">
          <el-input
            placeholder="请输入标题"
            resize="none"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 1 }"
            class="borderless-textarea"
            :show-word-limit="true"
            v-model="info.title"
          ></el-input>
        </div>
        <!--正文-->
        <div>
          <el-input
            v-model="info.text"
            resize="none"
            type="textarea"
            placeholder="请输入正文"
            :autosize="{ minRows: 18, maxRows: 18 }"
            class="borderless-textarea"
            :show-word-limit="true"
          />
          <el-row>
            <el-col :span="19"></el-col>
            <el-col :span="5">
              来自：{{globalStore.currentEmployee.name}}
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col v-else :span="15" style="border: 1px solid var(--el-border-color);">
        <!--顶部-->
        <div class="add-top">
          <div>浏览邮件</div>
        </div>
        <!--标题-->
        <div class="view-top">
          <div>
            <span style="font-size: 16px;font-weight: 600">
              {{currentEmail.title}}
            </span>
            <div>
              <div style="color: #909399">
                来自：{{currentEmail.name}}
              </div>
              <div style="color: #909399">
                邮箱：{{currentEmail.email}}
              </div>
              <div style="color: #909399">
                时间：{{currentEmail.date}}
              </div>
            </div>
          </div>
          <div>
            <el-avatar
              :size="70"
              :src="currentEmail.avatar"
            />
          </div>
        </div>
        <!--正文-->
        <div>
          <el-input
            v-model="currentEmail.text"
            resize="none"
            :disabled="true"
            type="textarea"
            placeholder="正文："
            :autosize="{ minRows: 17, maxRows: 17 }"
            class="borderless-textarea"
            :show-word-limit="true"
          />
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <!--寄件箱-->
      <el-col :span="8" style="border: 1px solid var(--el-border-color);">
        <el-table
          :data="sendEmailList"
          style="width: 100%"
          height="500"
        >
          <el-table-column>
            <template #header>
              <div style="display: flex;justify-content: space-between;">
                <div style="margin-bottom: 1px">寄件箱</div>
              </div>
            </template>
            <template #default="scope">
              <el-row style="height: 82px" class="pointer" @click="watchEmail(scope.row)">
                <el-col :span="3">
                  <el-avatar
                    :size="38"
                    :src="scope.row.avatar"
                  />
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="20" style="margin-left: -5px">
                  <el-row>
                    <el-col :span="1">
                      <span v-if="!isSend">
                        <span v-if="scope.row.sendPerson.some((item:any) => {
                          return item.username === globalStore.currentEmployee.username && item.read;
                        })" style="color: #67C23A;font-size: 30px;font-weight: 600;margin-left: -4px">·</span>
                        <span v-else style="color: #F56C6C;font-size: 30px;font-weight: 600;margin-left: -4px">·</span>
                      </span>
                      <span v-else style="color: #E6A23C;font-size: 30px;font-weight: 600;margin-left: -4px">·</span>
                    </el-col>
                    <el-col :span="17">
                      <span style="font-size: 16px;font-weight: 600">
                        {{scope.row.name}}
                      </span>
                      <el-tag v-if="scope.row.type === 'employee'" type="primary" size="small" style="margin-left: 6px;margin-top: -6px">
                        员工
                      </el-tag>
                      <el-tag v-else type="danger" size="small" style="margin-left: 6px;margin-top: -6px">
                        管理
                      </el-tag>
                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="5">
                      <span style="font-size: 12px;color: #909399">
                        {{scope.row.date.slice(5)}}
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span class="out-font" style="margin-top: -5px">
                        {{scope.row.title}}
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span class="out-text" style="margin-top: -7px">
                        {{scope.row.text}}
                      </span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无邮件" />
          </template>
        </el-table>
      </el-col>
      <el-col :span="1"></el-col>
      <!--  浏览邮件    -->
      <el-col :span="15" style="border: 1px solid var(--el-border-color);">
        <!--顶部-->
        <div class="add-top">
          <div>浏览寄件</div>
        </div>
        <!--标题-->
        <div class="view-top">
          <div>
            <span style="font-size: 16px;font-weight: 600">
              {{currentEmail.title}}
            </span>
            <div>
              <div style="color: #909399">
                寄给：{{currentEmail.sendPerson?.map((item:any) => item.name).join(', ')}}
              </div>
              <div style="color: #909399">
                邮箱：{{currentEmail.email}}
              </div>
              <div style="color: #909399">
                时间：{{currentEmail.date}}
              </div>
            </div>
          </div>
          <div>
            <el-avatar
              :size="70"
              :src="currentEmail.avatar"
            />
          </div>
        </div>
        <!--正文-->
        <div>
          <el-input
            v-model="currentEmail.text"
            resize="none"
            :disabled="true"
            type="textarea"
            placeholder="正文："
            :autosize="{ minRows: 17, maxRows: 17 }"
            class="borderless-textarea"
            :show-word-limit="true"
          />
        </div>
      </el-col>
    </el-row>
    <add-contact
      v-model="addContactDialog"
      ref="addContactDialogRef"
      @confirm-person="confirmPerson"
      @close="closeDialog"
    />
  </el-dialog>
</template>
<script setup lang="ts">
import { CircleCloseFilled, CirclePlus, Plus, Refresh, Promotion, Edit } from '@element-plus/icons-vue'
import { defineProps, onMounted, ref } from 'vue'
import { emailType } from '@/type'
import { globalSideStore } from '@/store/global-data'
import { emailSideData } from '@/store/email-side-data'
import { getTime } from '@/utils/time'
import AddContact from '@/components/add-contact.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: {
    type: String
  }
})
// 公共仓库
const globalStore = globalSideStore()
// 邮件库
const emailStore = emailSideData()
// 添加联系人组
const addPersonGroup = ref([])
// 收件箱
const receiveEmailList = ref([])
// 搜索寄件人
const sendPerson = ref()
// 个人收件箱
const myEmail = ref<any>([])
// 添加联系人弹窗
const addContactDialog = ref(false)
// 当前邮件信息
const currentEmail = ref({})
// 是否开始预览邮件
const isWatchEmail = ref(false)
// 备份完整邮件
const noChangeEmails = ref([])
// 是否寄件箱
const isSend = ref(false)
// 寄件箱数组
const sendEmailList = ref<any>([])
// 邮件基本信息
const info = ref<emailType>({
  username: '',
  name: '',
  type: '',
  text: '',
  date: '',
  sendPerson: [],
  title: '',
  email: '',
  avatar: ''
})
// 添加联系人弹窗ref
const addContactDialogRef = ref()
const isPoint = ref(false)

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  addContactDialog.value = false
}
/**
 * 关闭
 */
const close = () => {
  if (isPoint.value) {
    isPoint.value = false
    window.location.reload() // 刷新当前页面
  }
}
/**
 * 打开联系人弹窗
 */
const openAddContactDialog = () => {
  addContactDialog.value = true
}
/**
 * 发送邮件
 */
const sendEmail = () => {
  if (props.type === 'employee') {
    info.value.username = globalStore.currentEmployee?.username
    info.value.type = globalStore.currentEmployee?.type
    info.value.name = globalStore.currentEmployee?.name
    info.value.email = globalStore.currentEmployee?.email
    info.value.avatar = globalStore.currentEmployee?.avatar
  }
  if (props.type === 'manager') {
    info.value.username = globalStore.currentManager?.username
    info.value.type = globalStore.currentManager?.type
    info.value.name = globalStore.currentManager?.name
    info.value.email = globalStore.currentManager?.email
    info.value.avatar = globalStore.currentManager?.avatar
  }
  info.value.sendPerson = addPersonGroup.value
  info.value.date = getTime()
  // 设置未读
  for (let i = 0; i < info.value.sendPerson.length; i++) {
    info.value.sendPerson[i].read = false
  }
  emailStore.addEmailList(info.value)
}
/**
 * 确认添加-设置
 */
const confirmPerson = (addPersonList: any) => {
  addPersonGroup.value = addPersonList
}
/**
 * 点击邮件
 */
const watchEmail = (row:any) => {
  if (!isSend.value) {
    // 先判断
    row.sendPerson.forEach((item:any) => {
      if (item.username === globalStore.currentEmployee?.username) {
        console.log(item)
        if (!item.read) {
          isPoint.value = true
        }
      }
    })
    // 设置已读
    emailStore.setRead(row, globalStore.currentEmployee?.username as string)
  }
  currentEmail.value = row
  isWatchEmail.value = true
}
/**
 * 搜索寄件人
 */
const searchSendPerson = () => {
  myEmail.value = noChangeEmails.value
  myEmail.value = myEmail.value.filter((item: any) => {
    return item.name.includes(sendPerson.value)
  })
  console.log(myEmail.value)
}
/**
 * 新增邮件
 */
const add = () => {
  isWatchEmail.value = false
}
/**
 * 去往寄件箱
 */
const goSendEmail = () => {
  currentEmail.value = {}
  isSend.value = true
  sendEmailList.value = []
  // 寄件箱
  console.log(receiveEmailList.value)
  receiveEmailList.value.forEach((e:any) => {
    if (props.type === 'employee') {
      if (e.username === globalStore.currentEmployee?.username) {
        sendEmailList.value.push(e)
      }
    }
    if (props.type === 'manager') {
      if (e.username === globalStore.currentManager?.username) {
        sendEmailList.value.push(e)
      }
    }
  })
}
/**
 * 去往收件箱
 */
const goReceiveEmail = () => {
  currentEmail.value = {}
  isSend.value = false
  myEmail.value = []
  receiveEmailList.value.forEach((e:any) => {
    for (let i = 0; i < e.sendPerson.length; i++) {
      if (props.type === 'employee') {
        if (e.sendPerson[i].username === globalStore.currentEmployee?.username) {
          myEmail.value.push(e)
        }
      }
      if (props.type === 'manager') {
        if (e.sendPerson[i].username === globalStore.currentManager?.username) {
          myEmail.value.push(e)
        }
      }
    }
  })
}
onMounted(() => {
  // 收件箱
  receiveEmailList.value = emailStore.emailList as any
  receiveEmailList.value.forEach((e:any) => {
    for (let i = 0; i < e.sendPerson.length; i++) {
      if (props.type === 'employee') {
        if (e.sendPerson[i].username === globalStore.currentEmployee?.username) {
          myEmail.value.push(e)
        }
      }
      if (props.type === 'manager') {
        if (e.sendPerson[i].username === globalStore.currentManager?.username) {
          myEmail.value.push(e)
        }
      }
    }
  })
  noChangeEmails.value = myEmail.value
})
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.add-top {
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid var(--el-border-color);
  align-items: center;
  color: #909399;
  font-weight: 600;
}
/* 深度选择器穿透组件样式 */
:deep(.borderless-textarea .el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* 移除聚焦状态边框 */
:deep(.borderless-textarea .el-textarea__inner:focus) {
  outline: none !important;
  box-shadow: none !important;
}

/* 移除悬停状态边框 */
:deep(.borderless-textarea:hover .el-textarea__inner) {
  border-color: transparent !important;
}
.add-person {
  border: 1px solid var(--el-border-color);
  margin-right: 5px;
  margin-left: 5px;
  display: flex;
  align-items: center;
}
.top-title {
  height: 40px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
.out-font {
  font-size: 13px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.out-text {
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 20px;
  color: #909399;
}
.view-top {
  display: flex;
  justify-content: space-between;
  height: 80px;
  padding-top:10px;
  padding-left: 10px;
  padding-right: 10px
}
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background-color: transparent!important;
  color: #606266;
}
</style>
