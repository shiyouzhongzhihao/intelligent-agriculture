// 员工端日志类型
export interface employeeListType {
  diaryToken: string;
  diaryId: string;
  diaryClassify: string;
  airWetness: string;
  envTemperature: string;
  lightIntensity: string;
  staffId: string | undefined;
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
  createEmployee?: string;
  submitEmployee?: string;
  confirmEmployee?: string;
  approvalManager?: string;
  isEnv?: boolean;
  monitorDate?: string;
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
// 公共信息
export interface userType {
  username: string;
  password: string;
  email?: string;
  name?: string;
  type?: string;
  code?: number | null;
  address?: string;
  phone?: string;
  read?: boolean;
  avatar?: string;
}
// 环境数据
export interface envType {
  airWetness: string;
  envTemperature: string;
  lightIntensity: string;
  date: string;
}
// 邮箱数据
export interface emailType {
  username: string | undefined;
  name: string | undefined;
  text: string;
  type: string | undefined;
  date: string;
  sendPerson: userType[];
  title: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
}
