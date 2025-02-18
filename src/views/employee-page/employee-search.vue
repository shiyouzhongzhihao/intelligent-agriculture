<template>
  <el-form class="body">
    <el-row>
      <el-col :span="5">
        <el-form-item label="日志文号">
          <el-input placeholder="请输入日志文号" v-model="searchInfo.diaryId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="5">
        <el-form-item label="负责员工">
          <el-input placeholder="请输入员工姓名" v-model="searchInfo.staffId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2"></el-col>
      <el-col :span="5">
        <el-form-item label="日志分类">
          <el-select
            v-model="searchInfo.diaryClassify"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in diaryClassifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="5">
        <el-form-item label="审批状态">
          <el-select
            v-model="searchInfo.state"
            placeholder="请选择审批状态"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tag type="success">Tips: 点击日志标题可查看日志</el-tag>
      </el-col>
      <el-col :span="17"></el-col>
      <el-col :span="3">
        <div class="location-right">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="block"></div>
  </el-form>
</template>

<script setup lang="ts">
import { defineEmits, defineExpose, ref } from 'vue'
import { employeeListType, searchType } from '@/type'
import { employeeSideStore } from '@/store/employee-side-data'
import { globalSideStore } from '@/store/global-data'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['search'])
// 员工端数据仓库
const employeeStore = employeeSideStore()
// 公共仓库
const globalStore = globalSideStore()
// 搜索数据集合
const searchInfo = ref<searchType>({
  staffId: '',
  diaryId: '',
  diaryClassify: '',
  state: ''
})
// 搜索结果
const result = ref<employeeListType[]>([])
const diaryClassifyOptions = [
  {
    value: '1',
    label: '日常汇报'
  },
  {
    value: '2',
    label: '危险提醒'
  }
]
const stateOptions = [
  {
    value: '未提交',
    label: '未提交'
  },
  {
    value: '待审批',
    label: '待审批'
  },
  {
    value: '已审批',
    label: '已审批'
  }
]

/**
 * 搜索
 */
const search = () => {
  if (searchInfo.value.staffId === '' &&
    searchInfo.value.diaryId === '' &&
    searchInfo.value.diaryClassify === '' &&
    searchInfo.value.state === '') {
    // 消息类型设置为search
    globalStore.setMessageClassify('search')
    window.location.reload() // 刷新当前页面
  } else {
    result.value = employeeStore.searchEmployeeList(searchInfo.value)
    emit('search')
    ElMessage({
      message: '查询成功',
      type: 'success'
    })
  }
}
/**
 * 重置
 */
const reset = () => {
  // 消息类型设置为search
  globalStore.setMessageClassify('reset')
  window.location.reload() // 刷新当前页面
}
defineExpose({
  result
})
</script>

<style scoped lang="scss">
.body{
  margin-top: -15px;
}
</style>
