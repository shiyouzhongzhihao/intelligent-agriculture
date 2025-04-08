<template>
  <div>
    <div>
      <el-segmented v-model="value" :options="options" @change="changeEchart" style="margin-top: -100px">
        <template #default="scope">
          <div class="flex flex-col items-center gap-2 p-2" style="display:flex;align-items: center">
            <el-icon size="15" style="margin-right: 5px">
              <component :is="scope.item.icon" />
            </el-icon>
            <div>{{ scope.item.label }}</div>
          </div>
        </template>
      </el-segmented>
      <el-select
        v-model="selectValue"
        @change="changeSelectValue"
        placeholder="展示条数"
        style="width: 105px;margin-left: 175px"
        size="small"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="echarts" ref="chartDom"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
import { envSideStore } from '@/store/env-side-data'
import { Odometer, Umbrella, Sunny, Operation } from '@element-plus/icons-vue'

// 环境仓库
const envStore = envSideStore()
const selectValue = ref<number>()
selectValue.value = envStore.envNumber
const selectOptions = [
  {
    value: 10,
    label: '10条'
  },
  {
    value: 20,
    label: '20条'
  },
  {
    value: 30,
    label: '30条'
  },
  {
    value: 50,
    label: '50条'
  },
  {
    value: 100,
    label: '100条'
  }
]
// 图表名字
const title = ref<string>('')
// 选择导航
const value = ref('')
value.value = envStore.envClassify
const options = [
  {
    label: '总览',
    value: 'all',
    icon: Operation
  },
  {
    label: '环境温度',
    value: 'temperature',
    icon: Odometer
  },
  {
    label: '空气湿度',
    value: 'air',
    icon: Umbrella
  },
  {
    label: '光照强度',
    value: 'light',
    icon: Sunny
  }
]
// 数组处理
const temperatureArray = envStore.envDataList.map(item => item.envTemperature).slice(0, selectValue.value).reverse()
const airArray = envStore.envDataList.map(item => item.airWetness).slice(0, selectValue.value).reverse()
const lightArray = envStore.envDataList.map(item => item.lightIntensity).slice(0, selectValue.value).reverse()
const dateArray = envStore.envDataList.map(item => item.date).slice(0, selectValue.value).reverse()
const ehiList = ref<any>([])

/**
 * 温度评分逻辑
 * @param temp
 */
const calculateTempScore = (temp:any) => {
  if (temp < 10 || temp > 40) return 0 // 极端值直接0分
  if (temp >= 20 && temp <= 30) return 100 // 最佳区间满分

  // 过渡区间线性评分
  return temp < 20
    ? (temp - 10) * 10 // 10℃→0分，20℃→100分
    : 100 - (temp - 30) * 10 // 30℃→100分，40℃→0分
}

/**
 * 湿度评分逻辑
 * @param humidity
 */
const calculateHumidityScore = (humidity:any) => {
  if (humidity < 20 || humidity > 80) return 0
  if (humidity >= 40 && humidity <= 60) return 100
  return humidity < 40
    ? (humidity - 20) * 5 // 20%→0分，40%→100分
    : 100 - (humidity - 60) * 5 // 60%→100分，80%→0分
}

/**
 * 光照评分逻辑
 * @param light
 */
const calculateLightScore = (light:any) => {
  if (light < 1000) return 0
  if (light >= 5000 && light <= 30000) return 100
  return light < 5000
    ? (light - 1000) / 40 // 1000→0，5000→100
    : 100 - (light - 30000) / 700 // 30000→100，超过按每700lux扣1分
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
  ehiList.value = ehiList.value.splice(0, selectValue.value)
}
calculateEHIScores()
// 等级数组 1-5依次变好
const oneList = ref([])
const twoList = ref([])
const threeList = ref([])
const fourList = ref([])
const fiveList = ref([])
oneList.value = ehiList.value.filter((item:any) => item <= 20)
twoList.value = ehiList.value.filter((item:any) => item > 20 && item <= 40)
threeList.value = ehiList.value.filter((item:any) => item > 40 && item <= 60)
fourList.value = ehiList.value.filter((item:any) => item > 60 && item <= 80)
fiveList.value = ehiList.value.filter((item:any) => item > 80 && item <= 100)
//   创建响应式保存dom元素
const chartDom = ref(null)
// 一个承接数据的元素，与chartDom产生联系
let chartInstance = null
// 柱状图样式
const linear = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [{
    offset: 0, color: '#02bcff' // 0% 处的颜色
  }, {
    offset: 1, color: '#5555ff' // 100% 处的颜色
  }],
  global: false // 缺省为 false
}
// 当前图表数据
const currentOption = ref([])
/**
 * 数据判断
 */
if (envStore.envClassify === 'temperature') {
  currentOption.value = [{
    name: '环境温度',
    type: 'line',
    data: temperatureArray,
    lineStyle: {
      color: linear
    },
    itemStyle: {
      color: linear
    }
  }] as any
  title.value = '环境温度线形图'
} else if (envStore.envClassify === 'air') {
  currentOption.value = [{
    name: '空气湿度',
    type: 'bar',
    data: airArray,
    itemStyle: {
      color: linear,
      borderRadius: [30, 30, 0, 0]
    }
  }] as any
  title.value = '空气湿度柱状图'
} else if (envStore.envClassify === 'light') {
  currentOption.value = [{
    name: '光照强度',
    type: 'line',
    smooth: true,
    data: lightArray,
    itemStyle: {
      color: linear
    },
    areaStyle: {
      color: linear
    },
    lineStyle: {
      color: linear
    }
  }] as any
  title.value = '光照强度波形图'
} else if (envStore.envClassify === 'all') {
  currentOption.value = [
    {
      right: '50px',
      name: 'EHI环境健康指数',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: fiveList.value.length, name: '优秀 80-100' },
        { value: fourList.value.length, name: '良好 60-80' },
        { value: threeList.value.length, name: '中等 40-60' },
        { value: twoList.value.length, name: '较差 20-40' },
        { value: oneList.value.length, name: '危险 0-20' }
      ]
    }
  ] as any
  title.value = '环境健康指数饼状图'
}
// 表单配置
const option = {
  //   开始配置
  color: ['#67C23A', '#409EFF', '#337ECC', '#febc2e', '#F56C6C'],
  title: {
    text: title.value,
    left: '20px',
    subtext: envStore.envClassify === 'all' ? '环境健康指数（EHI）= (温度得分×0.4)+(湿度得分×0.3)+(光照得分×0.3)' : '',
    top: '10px'
  },
  tooltip: {
    trigger: envStore.envClassify === 'all' ? '' : 'axis'
  },
  legend: {
    orient: 'vertical',
    right: '20px'
  },
  xAxis: {
    data: envStore.envClassify !== 'all' ? dateArray : [],
    show: envStore.envClassify !== 'all'
  },
  yAxis: {},
  series: currentOption.value
}
/**
 * 修改echarts
 */
const changeEchart = () => {
  envStore.setEnvClassify(value.value)
}
/**
 * 修改条数
 */
const changeSelectValue = () => {
  envStore.setEnvNumber(selectValue.value as number)
}
//   挂载
onMounted(() => {
  chartInstance = echarts.init(chartDom.value)
  chartInstance.setOption(option)
})
</script>
<style scoped lang="scss">
.echarts {
  width: 670px;
  height: 600px;
}
</style>
