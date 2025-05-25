<template>
  <div>
    <el-table
      :data="managerList"
      stripe
      style="width: 95%;
      margin: 0 auto"
      v-loading="loading"
    >
      <el-table-column fixed label="日志文号" width="130">
        <template #default="scope">
          <el-button link type="primary" size="default" @click="viewDetail(scope.row)">
            {{scope.row.diaryId}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="diaryTitle" label="日志标题" width="250" />
      <el-table-column label="创建人" width="120">
        <template #default="scope">
          <span>{{scope.row.createEmployee}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" width="120">
        <template #default="scope">
          <span>{{scope.row.submitEmployee}}</span>
        </template>
      </el-table-column>
      <el-table-column label="催办状态" width="120">
        <template #default="scope">
          <span v-if="scope.row.remind === '未催办'">
            未催办
          </span>
          <span v-else class="danger">已催办</span>
        </template>
      </el-table-column>
      <el-table-column label="日志分类" width="120">
        <template #default="scope">
          <span v-if="scope.row.diaryClassify === '1'">
            日常汇报
          </span>
          <span v-else class="danger">危险提醒</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitDate" label="提交时间" width="120" />
      <el-table-column label="审批状态" width="120">
        <template #default="scope">
          <span :class="getStateClass(scope.row.state)">
            {{ scope.row.state }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="default" @click="approval(scope.row)" :disabled="scope.row.state==='已审批'">
            审批
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <add-dialog
      ref="addDialogRef"
      v-model="dialogState"
      :employeeDetail="employeeDetail"
      :type="type"
      :is-env="isEnv"
      @close="closeDialog"
    />
  </div>
</template>

<script setup lang="ts">
// 员工端数据仓库
import { employeeSideStore } from '@/store/employee-side-data'
import { onMounted, ref } from 'vue'
import { employeeListType } from '@/type'
import { getCompleteTime } from '@/utils/time'
import { globalSideStore } from '@/store/global-data'
import AddDialog from '@/components/add-dialog.vue'
import updateData from '@/utils/updateData'

const loading = ref(false)
const globalStore = globalSideStore()
// 单行日志详情
const employeeDetail = ref<employeeListType>()
// 添加日志弹窗组件ref
const addDialogRef = ref()
const employeeStore = employeeSideStore()
// 弹窗操作状态
const type = ref<string>('')
const managerList = ref()
// 新增-修改-查看弹窗显隐状态
const dialogState = ref<boolean>(false)
// 是否环境
const isEnv = ref<boolean>(false)
/**
 * 审批
 */
const approval = async (row:employeeListType) => {
  console.log(row)
  row.process = '已审批'
  row.state = '已审批'
  row.approvalManager = globalStore.currentManager?.name
  row.approvalDate = getCompleteTime()
  loading.value = true
  await updateData(employeeStore.employeeList)
  loading.value = false
  window.location.reload() // 刷新当前页面
}
/**
 * 设置审核状态颜色class
 * @param state 状态名
 */
const getStateClass = (state:string) => {
  if (state === '未提交') {
    return 'process-no-submit'
  } else if (state === '待审批') {
    return 'process-wait-audit'
  } else if (state === '已审批') {
    return 'process-success'
  }
  return ''
}
/**
 * 查看详情
 * @param row 单行数据
 */
const viewDetail = (row:employeeListType) => {
  type.value = 'view'
  isEnv.value = row.isEnv as boolean
  dialogState.value = true
  employeeDetail.value = row
  addDialogRef.value.getEmployeeDetail(row.diaryToken)
}
/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogState.value = false
}
onMounted(() => {
  // managerList.value = employeeStore.employeeList.filter(item => item.state !== '未提交')
  managerList.value = employeeStore.employeeList
    .filter(item => item.state !== '未提交') // 筛选状态
    .sort((a, b) => new Date(b.submitDate).getTime() - new Date(a.submitDate).getTime())
})
</script>

<style scoped lang="scss">

</style>
