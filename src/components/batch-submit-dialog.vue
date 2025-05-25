<!--
 * @Author: 钟郅豪
 * @Date: 2025/06/17 06:56:33
 * @LastEditors: 钟郅豪
 * @Description: 批量提交
 -->

<template>
  <el-dialog
    title="批量提交"
    width="55%"
    @close="close"
    class="batch-dialog"
    destroy-on-close
    style="max-height: 65vh;overflow-y: auto;"
  >
    <div class="location-align">
      <el-icon :size="20" color="#E6A23C"><Warning /></el-icon>
      <span class="font-style warning left-margin-min">请注意，您正在批量提交日志，在提交之前请先检查您的提交内容</span>
    </div>
    <div class="block"></div>
    <div class="demo-collapse" style="width: 95%;margin: auto">
      <el-collapse
        v-model="activeNames"
        v-for="(item,index) in selectList"
        :key="item"
      >
        <el-collapse-item :name="index">
          <template #title>
            <span class="location-align primary">
              日志标题：{{item.diaryTitle}}
            </span>
            <span class="location-align left-margin-mid primary">
              文号：{{item.diaryId}}
            </span>
            <span v-if="!item.batchChecked" class="location-align left-margin-mid danger">
              <el-icon class="header-icon">
                <warning />
              </el-icon>
              未检查
            </span>
            <span v-if="item.batchChecked" class="location-align left-margin-mid success">
              <el-icon class="header-icon">
                <circle-check />
              </el-icon>
              已检查
            </span>
          </template>
          <template #icon="{ isActive }">
            <span class="icon-ele">
              {{ isActive ? '折叠' : '展开' }}
            </span>
          </template>
          <el-form>
            <el-row>
              <el-col :span="6" :class="item.diaryClassify === '1' ? 'font-color' : 'danger'">日志类型：{{item.diaryClassify === '1' ? '日常汇报' : '危险提醒'}}</el-col>
              <el-col :span="6" class="font-color">空气湿度：{{item.airWetness}}</el-col>
              <el-col :span="6" class="font-color">光照强度：{{item.lightIntensity}}</el-col>
              <el-col :span="6" class="font-color">环境温度：{{item.envTemperature}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="font-color">数据说明：{{item.dataExplain}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="font-color">员工意见：{{item.staffSuggest}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <span class="location-right">
                  <el-checkbox v-model="item.batchChecked" label="已完成对日志的审核" size="default" />
                </span>
              </el-col>
              <el-col :span="1"></el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="batchSubmit">批量提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref, defineProps, PropType } from 'vue'
import { Warning, CircleCheck } from '@element-plus/icons-vue'
import { employeeListType } from '@/type'
import { ElMessage } from 'element-plus'
import { getCompleteTime } from '@/utils/time'
import { globalSideStore } from '@/store/global-data'
import updateData from '@/utils/updateData'
import { employeeSideStore } from '@/store/employee-side-data'

const props = defineProps({
  selectList: {
    type: Array as PropType<employeeListType[]>
  }
})
const employeeStore = employeeSideStore()
// 公共仓库
const globalStore = globalSideStore()
const activeNames = ref([0])
const emit = defineEmits(['batchClose'])

const close = () => {
  emit('batchClose')
}
/**
 * 批量提交
 */
const batchSubmit = async () => {
// 检查 selectList 中的每个对象的 batchChecked 属性
  const allChecked = props.selectList?.every(item => item.batchChecked === true)
  // 如果所有对象的 batchChecked 都为 true，继续执行下一步
  if (allChecked) {
    // 勾选完毕执行下一步
    props.selectList?.forEach(item => {
      item.state = '待审批'
      item.submitEmployee = globalStore.currentEmployee?.name
      item.submitDate = getCompleteTime()
      item.process = '已提交'
    })
    ElMessage({
      message: '批量提交成功',
      type: 'success'
    })
    await updateData(employeeStore.employeeList)
    emit('batchClose')
  } else {
    // 未全部勾选则不执行后续操作
    ElMessage({
      message: '请完成对日志的审核',
      type: 'warning'
    })
  }
}
</script>

<style scoped lang="scss">
.icon-ele {
  margin: 0 8px 0 auto;
  color: #409eff;
}
</style>
