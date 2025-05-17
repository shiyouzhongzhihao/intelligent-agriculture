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
      <el-text type="success">光照：30%以上</el-text>
    </div>
    <div style="margin-top: 5px">
      <el-table :data="envData" stripe style="width: 100%;height: 500px;">
        <el-table-column prop="date" label="时间" width="190" />
        <el-table-column prop="envTemperature" label="环境温度" width="120">
          <template #default="scope">
            <span :class="parseFloat(scope.row.envTemperature) < 15 || parseFloat(scope.row.envTemperature) > 35 ? 'danger' : ''">
              {{ parseFloat(scope.row.envTemperature) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="空气湿度" width="120">
          <template #default="scope">
            <span :class="parseFloat(scope.row.airWetness) < 20 || parseFloat(scope.row.airWetness) > 80 ? 'danger' : ''">
              {{ parseFloat(scope.row.airWetness) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="lightIntensity" label="光照强度" width="120">
          <template #default="scope">
            <span :class="parseFloat(scope.row.lightIntensity) < 30 ? 'danger' : ''">
              {{ parseFloat(scope.row.lightIntensity) }}
            </span>
          </template>

        </el-table-column>
        <!--        <el-table-column fixed="right" label="操作" min-width="110">-->
        <!--          <template #default="scope">-->
        <!--            <el-button link type="primary" size="default" @click="addDiary(scope.row)">-->
        <!--              新增日志-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
  newRow.lightIntensity = newRow.lightIntensity + '%'
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

  // 重置 envData
  envData.value = envStore.envDataList

  if (radio.value === 'temperature') {
    // 筛选温度数据，低于 15°C 或高于 35°C 属于危险范围
    envData.value = envData.value.filter((item: any) => {
      const temperature = parseFloat(item.envTemperature) // 提取数值部分
      return temperature < 15 || temperature > 35
    })
  } else if (radio.value === 'air') {
    // 筛选湿度数据，低于 20% 或高于 80% 属于危险范围
    envData.value = envData.value.filter((item: any) => {
      const airWetness = parseFloat(item.airWetness) // 提取数值部分
      return airWetness < 20 || airWetness > 80
    })
  } else if (radio.value === 'light') {
    // 筛选光照强度数据，低于 30% 属于危险范围
    envData.value = envData.value.filter((item: any) => {
      const lightIntensity = parseFloat(item.lightIntensity) // 提取数值部分
      return lightIntensity < 30 // 修改为30%
    })
  } else if (radio.value === 'all') {
    // 如果选择了 'all'，不进行任何过滤
    envData.value = envStore.envDataList
  }

  // 更新 envNumber 的值
  envNumber.value = envData.value.length
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
    // envStore.addEnvDataList(info.value)
  }, 1000000000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">

</style>
