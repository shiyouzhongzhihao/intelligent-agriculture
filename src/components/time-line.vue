<template>
  <el-dialog
    title="审批进度"
    width="55%"
    @close="close"
  >
    <el-timeline style="max-width: 600px">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { Check, MoreFilled } from '@element-plus/icons-vue'
import type { TimelineItemProps } from 'element-plus'
import { processType } from '@/type'

interface ActivityType extends Partial<TimelineItemProps> {
  content: string
}
const props = defineProps({
  employeeDetail: {
    type: Object
  }
})
const lineStateTwo = ref<processType>({
  // 第二流程
  content: '',
  type: undefined,
  icon: undefined
})
const lineStateThree = ref<processType>({
  // 第三流程
  content: '',
  type: undefined,
  icon: undefined,
  timestamp: ''
})
const lineStateFour = ref<processType>({
  // 第四流程
  content: '',
  type: undefined,
  icon: undefined,
  timestamp: ''
})
const lineStateFive = ref<processType>({
  // 第五流程
  content: '结束',
  type: undefined,
  icon: undefined,
  timestamp: ''
})
const activities = ref<ActivityType[]>([])
const emit = defineEmits(['timeLineClose'])
const close = () => {
  emit('timeLineClose')
}
watch([
  () => props.employeeDetail?.process,
  () => props.employeeDetail?.date,
  () => props.employeeDetail?.submitDate,
  () => props.employeeDetail?.approvalDate,
  () => props.employeeDetail?.confirmDate
]
, () => {
  if (props.employeeDetail?.process === '已新建') {
    lineStateTwo.value.type = 'primary'
    lineStateTwo.value.icon = MoreFilled
    lineStateTwo.value.content = '日志未提交'
    lineStateThree.value.type = undefined
    lineStateThree.value.icon = undefined
    lineStateThree.value.content = '日志未审批'
    lineStateThree.value.timestamp = '未到达此节点'
    lineStateFour.value.type = undefined
    lineStateFour.value.icon = undefined
    lineStateFour.value.content = '审批结果未确认'
    lineStateFour.value.timestamp = '未到达此节点'
    lineStateFive.value.type = undefined
    lineStateFive.value.icon = undefined
    lineStateFive.value.timestamp = '未到达此节点'
  } else if (props.employeeDetail?.process === '已提交') {
    lineStateTwo.value.content = '日志已提交'
    lineStateTwo.value.type = 'success'
    lineStateTwo.value.icon = Check
    lineStateThree.value.content = '日志未审批'
    lineStateThree.value.type = 'primary'
    lineStateThree.value.icon = MoreFilled
    lineStateThree.value.timestamp = '请等待管理端审批'
    lineStateFour.value.content = '审批结果未确认'
    lineStateFour.value.type = undefined
    lineStateFour.value.icon = undefined
    lineStateFour.value.timestamp = '未到达此节点'
    lineStateFive.value.type = undefined
    lineStateFive.value.icon = undefined
    lineStateFive.value.timestamp = '未到达此节点'
  } else if (props.employeeDetail?.process === '已审批') {
    lineStateTwo.value.content = '日志已提交'
    lineStateTwo.value.type = 'success'
    lineStateTwo.value.icon = Check
    lineStateThree.value.type = 'success'
    lineStateThree.value.icon = Check
    lineStateThree.value.content = '日志已审批'
    lineStateThree.value.timestamp = `审批时间：${props.employeeDetail?.approvalDate} 来源：管理部-：`
    lineStateFour.value.type = 'primary'
    lineStateFour.value.icon = MoreFilled
    lineStateFour.value.content = '审批结果未确认'
    lineStateFour.value.timestamp = '请确认审批结果'
    lineStateFive.value.type = undefined
    lineStateFive.value.icon = undefined
    lineStateFive.value.timestamp = '未到达此节点'
  } else if (props.employeeDetail?.process === '已确认') {
    lineStateTwo.value.content = '日志已提交'
    lineStateTwo.value.type = 'success'
    lineStateTwo.value.icon = Check
    lineStateThree.value.type = 'success'
    lineStateThree.value.icon = Check
    lineStateThree.value.content = '日志已审批'
    lineStateThree.value.timestamp = `审批时间：${props.employeeDetail?.approvalDate} 来源：管理部-`
    lineStateFour.value.type = 'success'
    lineStateFour.value.icon = Check
    lineStateFour.value.content = '审批结果已确认'
    lineStateFour.value.timestamp = `确认时间：${props.employeeDetail?.confirmDate} 来源：员工-${props.employeeDetail?.staffId}`
    lineStateFive.value.type = 'success'
    lineStateFive.value.icon = Check
    lineStateFive.value.timestamp = `结束时间：${props.employeeDetail?.confirmDate}`
  }
  activities.value = [
    {
      content: '新建日志',
      timestamp: `创建时间：${props.employeeDetail?.date} 来源：员工-${props.employeeDetail?.staffId}`,
      size: 'large',
      type: 'success',
      icon: Check
    },
    {
      content: lineStateTwo.value.content,
      type: lineStateTwo.value.type,
      timestamp: lineStateTwo.value.type === 'success' ? `提交时间：${props.employeeDetail?.submitDate} 来源：员工-${props.employeeDetail?.staffId}` : '请提交日志',
      size: 'large',
      icon: lineStateTwo.value.icon
    },
    {
      content: lineStateThree.value.content,
      type: lineStateThree.value.type,
      timestamp: lineStateThree.value.timestamp,
      size: 'large',
      icon: lineStateThree.value.icon
    },
    {
      content: lineStateFour.value.content,
      type: lineStateFour.value.type,
      timestamp: lineStateFour.value.timestamp,
      size: 'large',
      icon: lineStateFour.value.icon
    },
    {
      content: lineStateFive.value.content,
      type: lineStateFive.value.type,
      timestamp: lineStateFive.value.timestamp,
      size: 'large',
      icon: lineStateFive.value.icon
    }
  ]
})
</script>

<style lang="scss">

</style>
