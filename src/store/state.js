// import Vue from 'vue'
// import Vuex from 'vuex'
export default {
  cjq_list: [],
  cjq_mr: "",
  cjq_data: {},
  cjq_data_full: {},
  // 切换之后的网关序列号
  gserial: "",
  // 报警后信息
  warning_data: {},
  // 当前用户下的所有网关
  user_gateway_list: [],
  // 装有 当前网关下的报警信息的对象 含有 总条数
  warning_full_msg: {},
  // 所有區域信息
  region_List: [],
  // 根据区域号获取的元素
  ele_list: [],
  // 网关下的摄像头
  video_list: [],
  // 区域列表信息
  regional_list: [],
  // 设备信息列表
  device_list: [],
  // 根据区域获取的阈值
  threshold_list: [],
  // 设备的定时信息
  decice_time_list: [],
  // 站点id
  sId: "",
  // 农事管理列表
  farming_list: [],
  // 站点下的气象站列表
  weather_list: [],
  // 分出采集器 和 气象站
  cjq_qxz: true,
  // 获取气象站元素列表
  weather_ele_list: {},
  // 所有气象站实时数据
  weather_ele_list_full: [],
  // 气象站历史数据
  weather_historical_data_list: {}
};
