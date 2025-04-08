<template>
  <div class="env-table">
    <div style="margin-top: -5px;display: flex;justify-content: space-between;">
      <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio-button label="全部" value="all" />
        <el-radio-button label="温度异常" value="temperature" />
        <el-radio-button label="湿度异常" value="air" />
        <el-radio-button label="光照异常" value="light" />
      </el-radio-group>
      <el-text>共有{{envNumber}}条数据</el-text>
    </div>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <el-text type="success">安全阈值</el-text>
      <el-text type="success">温度：15℃-35℃</el-text>
      <el-text type="success">湿度：20%-80%</el-text>
      <el-text type="success">光照：2000Lux以上</el-text>
    </div>
    <div style="margin-top: 5px">
      <el-table :data="envData" stripe style="width: 100%;height: 500px;">
        <el-table-column prop="date" label="时间" width="120" />
        <el-table-column prop="envTemperature" label="环境温度" width="120">
          <template #default="scope">
            <span :class="scope.row.envTemperature < 15 || scope.row.envTemperature > 35 ? 'danger' : ''">
              {{scope.row.envTemperature}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="空气湿度" width="120">
          <template #default="scope">
            <span :class="scope.row.airWetness < 20 || scope.row.airWetness > 80 ? 'danger' : ''">
              {{scope.row.airWetness}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="lightIntensity" label="光照强度" width="120">
          <template #default="scope">
            <span :class="scope.row.lightIntensity < 2000 ? 'danger' : ''">
              {{scope.row.lightIntensity}}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="110">
          <template #default="scope">
            <el-button link type="primary" size="default" @click="addDiary(scope.row)">
              新增日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-dialog
      ref="addDialogRef"
      v-model="dialogState"
      :type="type"
      :isEnv="true"
      @close="closeDialog"
    />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { envSideStore } from '@/store/env-side-data'
import { randomEnvData } from '@/utils/random'
import { getCompleteTime } from '@/utils/time'
import { envType, employeeListType } from '@/type'
import AddDialog from '@/components/add-dialog.vue'

const envStore = envSideStore()
const addDialogRef = ref()
const dialogState = ref(false)
const radio = ref('all')
const envNumber = ref(0)
const type = ref('')
// 环境数据
const info = ref<envType>({
  lightIntensity: '',
  airWetness: '',
  envTemperature: '',
  date: ''
})
// 设置定时器
let timer:any = null
const envData = ref<any>([])
/**
 * 新增日志
 */
const addDiary = (row: envType) => {
  const newRow = { ...row }
  type.value = 'add'
  newRow.airWetness = newRow.airWetness + '%'
  newRow.lightIntensity = newRow.lightIntensity + 'Lux'
  newRow.envTemperature = newRow.envTemperature + '℃'
  envStore.setCurrentAddDiary(newRow)
  dialogState.value = true
  // 新增的时候全部置空
  addDialogRef.value.info = {} as employeeListType
}
/**
 * 分类筛选
 */
const changeRadio = () => {
  console.log(radio.value)
  if (radio.value === 'temperature') {
    envData.value = envStore.envDataList
    envData.value = envData.value.filter((item:any) => item.envTemperature < 15 || item.envTemperature > 35)
    envNumber.value = envData.value.length
  } else if (radio.value === 'air') {
    envData.value = envStore.envDataList
    envData.value = envData.value.filter((item:any) => item.airWetness < 20 || item.airWetness > 80)
    envNumber.value = envData.value.length
  } else if (radio.value === 'light') {
    envData.value = envStore.envDataList
    envData.value = envData.value.filter((item:any) => item.lightIntensity < 2000)
    envNumber.value = envData.value.length
  } else if (radio.value === 'all') {
    envData.value = envStore.envDataList
    envNumber.value = envData.value.length
  }
}
/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogState.value = false
}
onMounted(() => {
  envData.value = envStore.envDataList
  envNumber.value = envData.value.length
  console.log(envNumber.value)
  timer = setInterval(() => {
    const list = randomEnvData()
    info.value = {
      ...list,
      date: getCompleteTime() // 每次获取最新时间
    }
    console.log(info.value)
    envStore.addEnvDataList(info.value)
  }, 1000000000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">

</style>
