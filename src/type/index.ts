// 员工端日志类型
export interface employeeListType {
  diaryToken: string;
  diaryId: string;
  diaryClassify: string;
  airWetness: string;
  envTemperature: string;
  lightIntensity: string;
  staffId: string;
  diaryTitle: string;
  dataExplain: string;
  staffSuggest: string;
  date: string;
  state: string;
  batchChecked: boolean;
  remind: string;
  process: string;
  submitDate: string;
  approvalDate: string;
  confirmDate: string;
}
// 搜索
export type searchType = {
  diaryTitle?: string;
  diaryId: string;
  state: string;
  diaryClassify: string;
  staffId: string;
}
// 流程
export interface processType {
  content: string;
  icon: any;
  type: any;
  timestamp?: string;
}
