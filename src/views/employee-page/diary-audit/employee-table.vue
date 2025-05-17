<template>
  <div class="body">
    <el-form>
      <el-row>
        <el-col :span="12">
          <div v-if="!isSearch">
            <el-button type="primary" @click="addDiary">+ 新增日志</el-button>
          </div>
          <div v-else class="font-style">共搜索到{{employeeList.length}}条结果</div>
        </el-col>
        <el-col :span="12">
          <div style="display: flex;justify-content: flex-end;">
            <el-button type="primary" @click="batchSubmit">批量提交</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <add-dialog
      ref="addDialogRef"
      v-model="dialogState"
      :employeeDetail="employeeDetail"
      :type="type"
      :is-env="isEnv"
      @close="closeDialog"
    />
    <batch-submit-dialog
      v-model="batchDialogState"
      @batchClose="closeBatchDialog"
      :selectList="selectList"
    />
    <time-line
      v-model="timeLineDialogState"
      :employeeDetail="employeeDetail"
      @timeLineClose="timeLineClose"
    />
    <el-table :data="employeeList" stripe style="width: 100%" @selection-change="changeSelection">
      <el-table-column type="selection" :selectable="selectable" width="40"/>
      <el-table-column fixed label="日志文号" width="130">
        <template #default="scope">
          <el-button link type="primary" size="default" @click="viewDetail(scope.row)">
            {{scope.row.diaryId}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="staffId" label="负责员工" width="130" />
      <el-table-column label="日志分类" width="120">
        <template #default="scope">
          <span v-if="scope.row.diaryClassify === '1'">
            日常汇报
          </span>
          <span v-else class="danger">危险提醒</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="创建日期" width="120" />
      <el-table-column prop="lightIntensity" label="光照强度" width="100" />
      <el-table-column prop="envTemperature" label="环境温度" width="100" />
      <el-table-column prop="airWetness" label="空气湿度" width="100" />
      <el-table-column label="审批状态" width="100">
        <template #default="scope">
          <span :class="getStateClass(scope.row.state)">
            {{ scope.row.state }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="280">
        <template #default="scope">
          <el-button v-if="scope.row.state === '未提交'" link type="primary" size="default" @click="inputDiary(scope.row)">
            提交审批
          </el-button>
          <el-button v-if="scope.row.state === '待审批' && scope.row.remind === '未催办'" @click="remind(scope.row)" link type="primary" size="default">
            催办审批
          </el-button>
          <el-button v-if="scope.row.state === '待审批' && scope.row.remind === '已催办'" disabled link type="primary" size="default">
            已催办
          </el-button>
          <el-button v-if="scope.row.state === '已审批' && scope.row.process !== '已确认'" @click="confirm(scope.row)" link size="default" type="primary">
            确认审批
          </el-button>
          <el-button v-if="scope.row.state === '已审批' && scope.row.process === '已确认'" @click="confirm(scope.row)" disabled link size="default" type="primary">
            已确认
          </el-button>
          <el-button @click="viewProcess(scope.row)" link type="primary" size="default">
            查看进度
          </el-button>
          <el-button v-if="scope.row.state === '待审批'" link type="danger" size="default" @click="backDiary(scope.row)">
            撤回
          </el-button>
          <el-button v-if="scope.row.state === '未提交'" link type="primary" size="default" @click="editDiary(scope.row)">
            修改日志
          </el-button>
          <el-button v-if="scope.row.state === '未提交'" link type="danger" size="default" @click="deleteDiary(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <div v-if="!isSearch" class="location-right">
      <span class="default-font-size pagination font-style" style="margin-right: 20px">
        共{{employeeStore.employeeList.length}}条日志
      </span>
      <el-pagination
        size="small"
        :default-page-size="5"
        background
        layout="prev, pager, next"
        :total="employeeStore.employeeList.length"
        class="mt-4 pagination"
        v-model:current-page="page"
        @change="changePage"
      />
      <span class="pagination default-font-size font-style" style="margin-left: 20px">
        去往
        <el-input class="font-style" style="width: 30px;height: 25px" v-model="setPage"></el-input>
        页
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue'
import AddDialog from '@/components/add-dialog.vue'
import { employeeSideStore } from '@/store/employee-side-data'
import { employeeListType } from '@/type'
import { ElMessage, ElMessageBox } from 'element-plus'
import { globalSideStore } from '@/store/global-data'
import { messageClassifyEnums } from '@/enums'
import BatchSubmitDialog from '@/components/batch-submit-dialog.vue'
import TimeLine from '@/components/time-line.vue'
import { completeTime } from '@/utils/time'
import { envSideStore } from '@/store/env-side-data'

// 环境仓库
const envStore = envSideStore()
const props = defineProps({
  result: {
    type: Array
  }
})
// 新增-修改-查看弹窗显隐状态
const dialogState = ref<boolean>(false)
// 批量提交弹窗显隐状态
const batchDialogState = ref<boolean>(false)
// 进程查看弹窗显隐状态
const timeLineDialogState = ref<boolean>(false)
// 添加日志弹窗组件ref
const addDialogRef = ref()
// 员工端数据仓库
const employeeStore = employeeSideStore()
// 公共仓库
const globalStore = globalSideStore()
// 单行日志详情
const employeeDetail = ref<employeeListType>()
// 日志数组
const employeeList = ref<employeeListType[]>([])
// 当前页数
const page = ref<number>(1)
// 弹窗操作状态
const type = ref<string>('')
// 搜索状态
const isSearch = ref<boolean>(false)
// 多选框数组
const selectList = ref<employeeListType[]>([])
const selectable = (row: employeeListType) => ['未提交'].includes(row.state)
// 是否环境
const isEnv = ref<boolean>(false)
/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogState.value = false
}
const closeBatchDialog = () => {
  batchDialogState.value = false
}
const timeLineClose = () => {
  timeLineDialogState.value = false
}
/**
 * 新增日志
 */
const addDiary = () => {
  type.value = 'add'
  dialogState.value = true
  // 新增的时候全部置空
  addDialogRef.value.info = {} as employeeListType
}
/**
 * 修改日志
 * @param row 单行数据
 */
const editDiary = (row:employeeListType) => {
  console.log(row.isEnv)
  type.value = 'edit'
  dialogState.value = true
  employeeDetail.value = row
  isEnv.value = row.isEnv as boolean
  addDialogRef.value.getEmployeeDetail(row.diaryToken)
}
/**
 * 提交日志
 * @param row 单行数据
 */
const inputDiary = (row:employeeListType) => {
  row.submitEmployee = globalStore.currentEmployee?.name
  row.submitDate = completeTime
  row.state = '待审批'
  row.process = '已提交'
  window.location.reload() // 刷新当前页面
  ElMessage({
    message: '提交成功',
    type: 'success'
  })
}
/**
 * 删除日志
 * @param row 单行数据
 */
const deleteDiary = (row:employeeListType) => {
  console.log(row)
  employeeStore.deleteEmployeeList(row)
  envStore.deleteEnvDataList(row)
  // 消息类型设置为delete
  globalStore.setMessageClassify('delete')
}
/**
 * 确认审批
 * @param row
 */
const confirm = (row:employeeListType) => {
  console.log(row)
  row.confirmEmployee = globalStore.currentEmployee?.name
  row.confirmDate = completeTime
  row.process = '已确认'
  window.location.reload() // 刷新当前页面
}
/**
 * 撤回日志审批
 */
const backDiary = (row:employeeListType) => {
  ElMessageBox.confirm(
    '您确认撤回提交的日志审批吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '审批已撤回'
      })
      row.state = '未提交'
      row.remind = '未催办'
      row.process = '已新建'
    })
    .catch(() => {
      console.log('取消撤回')
    })
}
/**
 * 催办
 */
const remind = (row:employeeListType) => {
  row.remind = '已催办'
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
  console.log(employeeDetail.value)
  addDialogRef.value.getEmployeeDetail(row.diaryToken)
}
/**
 * 修改多选框
 * @param selection 多选框数组
 */
const changeSelection = (selection: employeeListType[]) => {
  console.log(selection)
  selectList.value = selection
}
/**
 * 批量提交
 */
const batchSubmit = () => {
  if (selectList.value.length > 0) {
    batchDialogState.value = true
    console.log(selectList.value)
  } else {
    ElMessage({
      message: '请先选择需要批量上传的日志',
      type: 'warning'
    })
  }
}
/**
 * 查看审批进度
 */
const viewProcess = (row:employeeListType) => {
  timeLineDialogState.value = true
  employeeDetail.value = row
  console.log(employeeDetail.value)
}
/**
 * 更改页数
 */
const changePage = () => {
  const itemsPerPage = 5 // 每页显示的项目数
  const startIndex = (page.value - 1) * itemsPerPage // 计算起始索引
  const endIndex = startIndex + itemsPerPage // 计算结束索引

  // 从 employeeStore.employeeList 中提取当前页的元素
  employeeList.value = employeeStore.employeeList.slice(startIndex, endIndex)
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
watch(() => props.result, (newVal) => {
  employeeList.value = newVal as any
  isSearch.value = true
})
/**
 * 挂载
 */
onMounted(() => {
  // 抛出数组
  employeeList.value = employeeStore.employeeList.slice(0, 5)
  // 新增类型消息
  if (globalStore.messageClassify === messageClassifyEnums.add) {
    ElMessage({
      message: '新增成功',
      type: 'success'
    })
    // 用完记得置空
    globalStore.setMessageClassify('')
  } else if (globalStore.messageClassify === messageClassifyEnums.delete) {
    // 删除类型消息
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    // 用完记得置空
    globalStore.setMessageClassify('')
  } else if (globalStore.messageClassify === messageClassifyEnums.edit) {
    // 修改类型消息
    ElMessage({
      message: '保存成功',
      type: 'success'
    })
    // 用完记得置空
    globalStore.setMessageClassify('')
  } else if (globalStore.messageClassify === messageClassifyEnums.search) {
    // 修改类型消息
    ElMessage({
      message: '查询成功',
      type: 'success'
    })
    // 用完记得置空
    globalStore.setMessageClassify('')
  } else if (globalStore.messageClassify === messageClassifyEnums.reset) {
    // 修改类型消息
    ElMessage({
      message: '重置成功',
      type: 'success'
    })
    // 用完记得置空
    globalStore.setMessageClassify('')
  }
})
</script>

<style scoped lang="scss">
.body{
  .pagination {
    margin-top: 20px;
  }
}
</style>
