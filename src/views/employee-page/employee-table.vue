<template>
  <div class="body">
    <el-form>
        <el-row>
          <el-col :span="12">
            <div>
              <el-button type="primary" @click="addDiary">+ 新增数据</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="display: flex;justify-content: flex-end;">
              <el-button type="primary">批量提交</el-button>
            </div>
          </el-col>
        </el-row>
    </el-form>
    <add-dialog
      ref="addDialogRef"
      v-model="dialogState"
      :employeeDetail="employeeDetail"
      :type="type"
      @close="closeDialog"
    />
    <el-table :data="employeeList" stripe style="width: 100%">
      <el-table-column fixed label="日志标题" width="150">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="viewDetail(scope.row)">
            {{scope.row.diaryTitle}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="diaryId" label="日志文号" width="150" />
      <el-table-column label="日志分类" width="150">
        <template #default="scope">
          <span v-if="scope.row.diaryClassify === '1'">
            日常汇报
          </span>
          <span v-else class="danger">危险提醒</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="lightIntensity" label="光照强度" width="120" />
      <el-table-column prop="envTemperature" label="环境温度" width="150" />
      <el-table-column prop="airWetness" label="空气湿度" width="120" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="inputDiary(scope.row)">
            提交日志
          </el-button>
          <el-button link type="primary" size="small" @click="editDiary(scope.row)">
            修改日志
          </el-button>
          <el-button link type="danger" size="small" @click="deleteDiary(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="location-right">
      <span class="default-font-size pagination" style="margin-right: 20px">
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
      <span class="pagination default-font-size" style="margin-left: 20px">
        去往
      <el-input style="width: 30px;height: 25px" v-model="setPage"></el-input>
        页
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddDialog from '@/components/add-dialog.vue'
import { employeeSideStore } from '@/store/employee-side-data'
import { employeeListType } from '@/type'
import { ElMessage } from 'element-plus'
import { globalSideStore } from '@/store/global-data'
import { messageClassifyEnums } from '@/enums'

// 弹窗状态
const dialogState = ref<boolean>(false)
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
// 弹窗状态
const type = ref<string>('')
/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogState.value = false
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
  type.value = 'edit'
  dialogState.value = true
  employeeDetail.value = row
  addDialogRef.value.getEmployeeDetail(row.diaryToken)
}
/**
 * 提交日志
 * @param row 单行数据
 */
const inputDiary = (row:employeeListType) => {
  console.log(row)
}
/**
 * 删除日志
 * @param row 单行数据
 */
const deleteDiary = (row:employeeListType) => {
  console.log(row)
  employeeStore.deleteEmployeeList(row)
  // 消息类型设置为delete
  globalStore.setMessageClassify('delete')
}
/**
 * 查看详情
 * @param row 单行数据
 */
const viewDetail = (row:employeeListType) => {
  type.value = 'view'
  dialogState.value = true
  employeeDetail.value = row
  addDialogRef.value.getEmployeeDetail(row.diaryToken)
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
  }
})
</script>

<style scoped lang="scss">
.body{
  width: 85%;
  margin: 0 auto;
  .pagination {
    margin-top: 20px;
  }
}
</style>
