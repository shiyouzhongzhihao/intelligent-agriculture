<template>
  <div>
    <el-table :data="managerList" stripe style="width: 100%">
      <el-table-column fixed label="日志文号" width="130">
        <template #default="scope">
          <el-button link type="primary" size="default" @click="viewDetail(scope.row)">
            {{scope.row.diaryId}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="diaryTitle" label="日志标题" width="300" />
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
          <el-button link type="primary" size="default" @click="approval(scope.row)">
            审批
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
// 员工端数据仓库
import { employeeSideStore } from '@/store/employee-side-data'
import { onMounted, ref } from 'vue'
import { employeeListType } from '@/type'
import { completeTime } from '@/utils/time'

const employeeStore = employeeSideStore()
const managerList = ref()
/**
 * 审批
 */
const approval = (row:employeeListType) => {
  console.log(row)
  row.process = '已审批'
  row.state = '已审批'
  row.approvalDate = completeTime
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
onMounted(() => {
  // managerList.value = employeeStore.employeeList.filter(item => item.state !== '未提交')
  managerList.value = employeeStore.employeeList
    .filter(item => item.state !== '未提交') // 筛选状态
    .sort((a, b) => new Date(a.submitDate).getTime() - new Date(b.submitDate).getTime())
})
</script>

<style scoped lang="scss">

</style>
