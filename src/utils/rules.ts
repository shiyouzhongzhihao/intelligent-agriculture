// validationRules.ts
const rules = {
  diaryId: [
    { required: true, message: '请输入日志文号', trigger: ['blur'] }
  ],
  diaryClassify: [
    { required: true, message: '请选择日志类型', trigger: 'blur' }
  ],
  airWetness: [
    { required: true, message: '请输入空气湿度', trigger: 'blur' }
  ],
  envTemperature: [
    { required: true, message: '请输入环境温度', trigger: 'blur' }
  ],
  lightIntensity: [
    { required: true, message: '请输入光照强度', trigger: 'blur' }
  ],
  diaryTitle: [
    { required: true, message: '请输入日志标题', trigger: 'blur' }
  ],
  dataExplain: [
    { required: true, message: '请输入数据说明', trigger: 'blur' }
  ],
  staffSuggest: [
    { required: true, message: '请输入员工意见', trigger: 'blur' }
  ]
}
export default rules
