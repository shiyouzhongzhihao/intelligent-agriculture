<template>
  <el-dialog
    :title="title"
    width="55%"
    @close="close"
    :close-on-click-modal="type !== dialogStateEnums.edit"
    :show-close="type !== dialogStateEnums.edit"
  >
    <el-form
      ref="formRef"
      :model="info"
      :rules="rules"
      :show-message="type !== dialogStateEnums.view"
      :hide-required-asterisk="type === dialogStateEnums.view"
      :disabled="type === dialogStateEnums.view"
    >
      <el-row>
        <el-col :span="11">
          <el-form-item label="日志文号" prop="diaryId">
            <el-input
              v-model="info.diaryId"
              placeholder="请输入日志文号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="日志类型" prop="diaryClassify">
            <el-radio-group v-model="info.diaryClassify" style="margin-top: -4px">
              <el-radio value="1" size="large">日常汇报</el-radio>
              <el-radio value="2" size="large">危险提醒</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="空气湿度" prop="airWetness">
            <el-input
              v-model="info.airWetness"
              placeholder="请输入空气湿度"
            >
              <template #append v-if="type === dialogStateEnums.add">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="环境温度" prop="envTemperature">
            <el-input
              v-model="info.envTemperature"
              placeholder="请输入环境温度"
            >
              <template #append v-if="type === dialogStateEnums.add">℃</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="光照强度" prop="lightIntensity">
            <el-input
              v-model="info.lightIntensity"
              placeholder="请输入光照强度"
            >
              <template #append v-if="type === dialogStateEnums.add">Lux</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="员工姓名" prop="staffId">
            <el-input
              v-model="info.staffId"
              placeholder="请输入员工姓名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="日志标题" prop="diaryTitle">
            <el-input
              v-model="info.diaryTitle"
              type="textarea"
              placeholder="请输入日志标题"
              autosize
              resize="none"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="数据说明" prop="dataExplain">
            <el-input
              v-model="info.dataExplain"
              type="textarea"
              placeholder="请输入数据说明"
              autosize
              resize="none"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="员工意见" prop="staffSuggest">
            <el-input
              v-model="info.staffSuggest"
              type="textarea"
              placeholder="请输入员工意见"
              autosize
              resize="none"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="type === dialogStateEnums.add" @click="close">取消</el-button>
        <el-button v-if="type === dialogStateEnums.add" type="primary" @click="add">
          新增
        </el-button>
        <el-button v-if="type === dialogStateEnums.edit" type="primary" @click="edit">确定</el-button>
        <el-button v-if="type === dialogStateEnums.view" type="primary" @click="close">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, ref, defineEmits, defineExpose, watch } from 'vue'
import { employeeSideStore } from '@/store/employee-side-data'
import { setRandom } from '@/utils/random'
import { completeTime } from '@/utils/time'
import rules from '@/utils/rules'
import { employeeListType } from '@/type'
import { dialogStateEnums } from '@/enums'
import { globalSideStore } from '@/store/global-data'

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close'])
// 页面填写信息
const info = ref<employeeListType>({
  // 唯一标识id
  diaryToken: '',
  // 日志文号
  diaryId: '',
  // 日志分类
  diaryClassify: '',
  // 空气湿度
  airWetness: '',
  // 环境温度
  envTemperature: '',
  // 光照强度
  lightIntensity: '',
  // 员工工号
  staffId: '',
  // 日志标题
  diaryTitle: '',
  // 数据说明
  dataExplain: '',
  // 员工意见
  staffSuggest: '',
  // 日期
  date: '',
  // 审批状态
  state: '',
  // 批量提交是否检查
  batchChecked: false,
  // 催办状态
  remind: '',
  // 日志进程状态
  process: '',
  // 提交时间
  submitDate: '',
  // 审批时间
  approvalDate: '',
  // 确认（结束）时间
  confirmDate: ''
})
const title = ref<string>('')
// 定义仓库
const employeeStore = employeeSideStore()
// 公共仓库
const globalStore = globalSideStore()
const formRef = ref()
const close = () => {
  emit('close')
}
const edit = () => {
  // 表单验证
  formRef.value.validate((valid: any) => {
    if (valid) {
      // 消息类型设置为edit
      globalStore.setMessageClassify('edit')
      window.location.reload() // 刷新当前页面
      // 关闭弹窗
      emit('close')
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}
/**
 * 新增日志
 */
const add = () => {
  // 表单验证
  formRef.value.validate((valid: any) => {
    if (valid) {
      console.log('表单验证通过，执行新增逻辑')
      // 传入当前的时间和随机生成的唯一token
      info.value.date = completeTime
      info.value.diaryToken = setRandom()
      // 空气湿度单位补充
      info.value.airWetness = info.value.airWetness + '%'
      // 环境温度单位补充
      info.value.envTemperature = info.value.envTemperature + '℃'
      // 光照强度单位补充
      info.value.lightIntensity = info.value.lightIntensity + 'Lux'
      // 审批状态设定
      info.value.state = '未提交'
      // 催办状态初始值设定
      info.value.remind = '未催办'
      // 批量提交检查初始值
      info.value.batchChecked = false
      // 日志进程状态初始值
      info.value.process = '已新建'
      // 仓库增加处理
      employeeStore.addEmployeeList(info.value)
      // 消息类型设置为add
      globalStore.setMessageClassify('add')
      // 关闭弹窗
      emit('close')
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}
/**
 * 获取单行数据细节信息
 * @param diaryToken 唯一token
 */
const getEmployeeDetail = (diaryToken: any) => {
  info.value = employeeStore.viewEmployeeDetail(diaryToken) as employeeListType
}
watch(() => props.type, (newVal) => {
  if (newVal === 'add') {
    title.value = '新增日志'
  } else if (newVal === 'view') {
    title.value = '查看日志'
  } else if (newVal === 'edit') {
    title.value = '修改日志'
  }
})
defineExpose({
  getEmployeeDetail,
  info
})
</script>

<style lang="scss">

</style>
