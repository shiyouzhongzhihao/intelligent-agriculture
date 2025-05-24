<template>
  <div style="color: #409EFF;font-size: 16px;font-weight: 500;display: flex;align-items: center;">
    总览面板
    <el-icon :size="18" style="margin-left: 3px" color="#409EFF">
      <Stopwatch></Stopwatch>
    </el-icon>
  </div>
  <el-row class="body">
    <el-col :span="5">
      <el-countdown format="DD [days] HH:mm:ss" :value="date">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            <el-icon style="margin-right: 4px" :size="12">
              <Calendar />
            </el-icon>
            距离下一个工月
          </div>
        </template>
      </el-countdown>
      <div class="countdown-footer">{{ date.format('YYYY-MM-DD') }}</div>
    </el-col>
    <el-col :span="5">
      <el-progress type="dashboard" :percentage="ehiScore" :color="colors">
        <template #default>
          <el-statistic class="percentage-value" style="margin-top: -20px" :value="ehiScore"/>
          <span class="percentage-label">环境健康指数(EHI)</span>
        </template>
      </el-progress>
    </el-col>
    <el-col :span="5">
      <el-statistic :value="dangerData">
        <template #title>
          <div style="display: inline-flex; align-items: center;">
            <span>环境危险数据</span>
            <el-tooltip
              effect="dark"
              content="监测环境温度，湿度以及光照强度"
              placement="top"
            >
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-statistic>
      <!--      <el-button class="countdown-footer" type="primary" @click="reset">-->
      <!--        查看-->
      <!--      </el-button>-->
    </el-col>
    <el-col :span="5">
      <el-statistic title="待确认日志" :value="confirmData"/>
      <!--      <el-button class="countdown-footer" type="primary" @click="reset">-->
      <!--        查看-->
      <!--      </el-button>-->
    </el-col>
    <el-col :span="4">
      <el-statistic title="未读邮件" :value="noRead">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
      <!--      <el-button class="countdown-footer" type="primary" @click="reset">-->
      <!--        查看-->
      <!--      </el-button>-->
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useTransition } from '@vueuse/core'
import { Calendar, ChatLineRound, Warning, Stopwatch } from '@element-plus/icons-vue'
import { envSideStore } from '@/store/env-side-data'
import { employeeSideStore } from '@/store/employee-side-data'
import { emailSideData } from '@/store/email-side-data'
import { globalSideStore } from '@/store/global-data'

const colors = [
  { color: '#F56C6C', percentage: 20 },
  { color: '#febc2e', percentage: 40 },
  { color: '#337ECC', percentage: 60 },
  { color: '#409EFF', percentage: 80 },
  { color: '#67C23A', percentage: 100 }
]
const emailStore = emailSideData()
const globalStore = globalSideStore()
// 控制距离日期
const date = ref(dayjs().add(1, 'month').startOf('month'))
const dangerDataNumber = ref(0)
const confirmDataNumber = ref(0)
const ehiScoreNumber = ref(0)
const envStore = envSideStore()
const employeeStore = employeeSideStore()
const ehiList = ref<any>([])
const emailList = ref<any>([])
const noRead = ref(0)
const dangerData = useTransition(dangerDataNumber, {
  duration: 500
})
const confirmData = useTransition(confirmDataNumber, {
  duration: 500
})
const ehiScore = useTransition(ehiScoreNumber, {
  duration: 500
})
/**
 * 温度评分逻辑
 * @param temp
 */
const calculateTempScore = (temp: any) => {
  const temperature = parseFloat(temp) // 去除单位并转为数字
  if (temperature < 10 || temperature > 40) return 0 // 极端值直接0分
  if (temperature >= 20 && temperature <= 30) return 100 // 最佳区间满分

  // 过渡区间线性评分
  return temperature < 20
    ? (temperature - 10) * 10 // 10℃→0分，20℃→100分
    : 100 - (temperature - 30) * 10 // 30℃→100分，40℃→0分
}

/**
 * 湿度评分逻辑
 * @param humidity
 */
const calculateHumidityScore = (humidity: any) => {
  const humidityValue = parseFloat(humidity) // 去除单位并转为数字
  if (humidityValue < 20 || humidityValue > 80) return 0
  if (humidityValue >= 40 && humidityValue <= 60) return 100
  return humidityValue < 40
    ? (humidityValue - 20) * 5 // 20%→0分，40%→100分
    : 100 - (humidityValue - 60) * 5 // 60%→100分，80%→0分
}

/**
 * 光照评分逻辑
 * @param light
 */
const calculateLightScore = (light: any) => {
  const lightValue = parseFloat(light) // 去除单位并转为数字
  if (lightValue < 20) return 0 // 低于20%光照强度给0分
  if (lightValue >= 80) return 100 // 超过80%光照强度给100分
  if (lightValue >= 60) {
    // 60%-80%之间，分数从100开始递减
    return 100 - (lightValue - 60) * (100 / 20) // 60%光照得100分，80%光照得0分
  }
  // 20%-60%之间，分数从0线性增加到100
  return (lightValue - 20) * (100 / 40) // 20%光照得0分，60%光照得100分
}

/**
 * 评分计算函数
 */
const calculateEHIScores = () => {
  ehiList.value = envStore.envDataList.map(item => {
    const tempScore = calculateTempScore(item.envTemperature)
    const humidityScore = calculateHumidityScore(item.airWetness)
    const lightScore = calculateLightScore(item.lightIntensity)
    const ehi = (
      tempScore * 0.4 +
      humidityScore * 0.3 +
      lightScore * 0.3
    )
    return Math.min(100, Math.max(0, Number(ehi.toFixed(2))))
  })
}
onMounted(() => {
  calculateEHIScores()
  for (let i = 0; i < ehiList.value.length; i++) {
    ehiScoreNumber.value = ehiList.value[i] + ehiScoreNumber.value
  }
  ehiScoreNumber.value = ehiScoreNumber.value / ehiList.value.length
  confirmDataNumber.value = employeeStore.employeeList.filter(item => item.state === '已审批' && item.process !== '已确认').length
  dangerDataNumber.value = envStore.envDataList.filter((item: any) =>
    (parseFloat(item.airWetness) < 20 || parseFloat(item.airWetness) > 80) ||
    (parseFloat(item.envTemperature) < 15 || parseFloat(item.envTemperature) > 35) ||
    (parseFloat(item.lightIntensity) < 30)
  ).length

  emailList.value = emailStore.emailList
  emailList.value.forEach((item:any) => {
    for (let i = 0; i < item.sendPerson.length; i++) {
      if (item.sendPerson[i].username === globalStore.currentEmployee?.username) {
        if (!item.sendPerson[i].read) {
          noRead.value++
        }
      }
    }
  })
})
</script>

<style scoped>
.body {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border: 1px solid var(--el-border-color);
  margin-top: 5px;
}
.el-col {
  text-align: center;
}
.countdown-footer {
  margin-top: 8px;
}
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>
