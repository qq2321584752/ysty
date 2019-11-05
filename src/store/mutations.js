export default {
  // 获取采集器
  collector(state, res) {
    if (!res[0]) {
      state.cjq_list = [];

      return false;
    }
    //

    state.cjq_list = res;

    state.cjq_mr = res[0].addr;
    //
  },
  // 清除采集器数据
  cjq_list_clear(state, res) {
    state.cjq_list = [];
  },
  // 获取采集器实时数据
  collector_data(state, res) {
    if (!res.labels) {
      state.cjq_data = {};

      return false;
    }
    res.labels.forEach(item => {
      item.src = require(`../assets/img/${item.elementId}.png`);
      //
    });

    var obj = { ...res };
    state.cjq_data = obj;
  },

  // 保存全局网关序列号
  gserial(state, res) {
    //
    state.gserial = res;
  },
  warning_list(state, res) {
    state.warning_data = res;
  },
  // 提交所有网关列表
  user_gateway(state, res) {
    state.user_gateway_list = res;
    //
  },
  // 获取当前网关下的报警信息首次
  warning_all(state, res) {
    state.warning_full_msg = res;
    //
  },
  // 获取网关下的区域信息
  region_list(state, res) {
    state.region_List = res;
    //
  },
  // 根据区域信息获取 元素
  ele_mutations(state, res) {
    state.ele_list = res;
  },
  // 网关下的摄像头
  gateway_video(state, res) {
    state.video_list = res;
  },
  // 提交设备控制 回去区域信息
  get_regional(state, res) {
    if (!res) {
      state.regional_list = [];
      return false;
    }
    state.regional_list = res;
  },
  // 根据区域信息获取 设备
  get_device(state, res) {
    if (!res) {
      state.device_list = [];
      return false;
    }

    res.forEach(item => {
      item.icon = require(`../assets/img/device/${item.deviceType}.png`);
      item.icon_AA = require(`../assets/img/device/${item.deviceType}.png`);
      item.loading = false;
      //

      if (!item.isDoubleSwitch) {
        item.icon_gif = require(`../assets/img/device/device_gif/${item.deviceType}.gif`);
        // 单路设备处理
        if (item.curData == "64") {
          item.lock = true;
        } else {
          item.lock = false;
        }
        // 双路设备处理
      } else {
        item.icon_gif_64 = require(`../assets/img/device/device_gif/${item.deviceType}_64.gif`);
        item.icon_gif_00 = require(`../assets/img/device/device_gif/${item.deviceType}_00.gif`);
        // if (item.curData == "64") {
        //   item.lock = true;
        // } else if (item.curData == "00") {
        //   item.lock = false;
        // } else {
        // }
      }

      // item.
    });
    //

    state.device_list = res;
  },
  // 根据区域获取阈值
  get_threshold(state, res) {
    state.threshold_list = res;
  },
  get_decice_time(state, res) {
    state.decice_time_list = res || [];
  },
  // 保存站点id
  s_id(state, res) {
    state.sId = res;
  },
  // 获取农事信息
  get_farming_list(state, res) {
    if (!res) {
      state.farming_list = [];

      return false;
    }
    state.farming_list = res;
  },
  // 获取站点下的气象站
  get_weather(state, res) {
    if (!res) return (state.weather_list = []);
    state.weather_list = res;
  },
  // 控制采集器 还是 气象站的显示
  cjq_qxz_negation(state, f_t) {
    //

    state.cjq_qxz = f_t;
  },
  // 气象站下的 元素实时数据
  get_weather_ele(state, res) {
    state.weather_ele_list = res;
  },
  // 所有气象站实时数据
  get_weather_ele_full(state, res) {
    state.weather_ele_list_full = res;
  },
  // 气象站历史数据
  get_weather_historical_data(state, res) {
    state.weather_historical_data_list = res;
  }
};
