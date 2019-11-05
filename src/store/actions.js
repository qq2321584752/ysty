import Qs from "qs";
export default {
  // 获取采集器
  async collector(context, payload) {
    if (!context.state.gserial) return false;
    let { data: res } = await this.$http(
      `/collector/listByGSerial/${context.state.gserial}`
    );
    if (!res.datas) {
      return context.commit("collector", []);
    }
    context.commit("collector", res.datas);
    //
  },
  // 获取采集器下的元素实时数据
  async collector_data(context, payload) {
    //

    let { data: res } = await this.$http.post(
      "/data/master",
      Qs.stringify(payload)
    );
    context.commit("collector_data", res);

    //
  },
  // 点击全屏后获取所有元素的实时数据
  async collector_data_full(context, payload) {
    var arr = [];

    // context.state.cjq_list.forEach(async item => {
    for (var i = 0; i < context.state.cjq_list.length; i++) {
      var obj = {
        gSerial: payload.gSerial,
        collectorAddr: context.state.cjq_list[i].addr
      };
      var { data: res } = await this.$http.post(
        "/data/realtime",
        Qs.stringify(obj)
      );
      arr.push(res);
    }

    context.commit("collector_data_full", arr);

    // });
    //

    //
  },

  // 获取当前网关的报警日志
  async warning(context) {
    var obj = {
      gSerial: context.state.gserial
    };
    //

    let { data: res } = await this.$http.post(
      "/alermMsg/listByGSerial",
      Qs.stringify(obj)
    );

    context.commit("warning_list", res);
    //
  },

  // 获取所选网关报警日志
  async warning_all(context, payload) {
    // var obj = {
    //     gSerial:payload.gSerial,
    // }
    // payload.gSerial = context.state.gserial;
    let { data: res } = await this.$http.post(
      "/alermMsg/listByGSerial",
      Qs.stringify(payload)
    );
    if (res.status != 0) {
      context.commit("warning_all", {});
      return false;
    }
    context.commit("warning_all", res);
  },

  // 获取用户下所有的网关
  async user_gateway(context, payload) {
    var uId = JSON.parse(window.sessionStorage.getItem("user_info")).id;
    //

    let { data: res } = await this.$http(`/gateWay/listByUId/${uId}`);
    //

    context.commit("user_gateway", res.datas);
  },

  // 获取当前 网关下的区域信息
  async region_list(context, payload) {
    let { data: res } = await this.$http(`/regionInfo/list/${payload}`);

    context.commit("region_list", res.datas);
  },
  // 获取 区域下的元素
  async ele_actions(context, payload) {
    let { data: res } = await this.$http.post(
      `/alermOrder/list`,
      Qs.stringify(payload)
    );
    //
    context.commit("ele_mutations", res.datas);
  },
  //    获取网关下的 视频信息
  async gateway_video(context, payload) {
    var gSerial = context.state.gserial;
    let { data: res } = await this.$http(`/cameraG/listByGSerial/${gSerial}`);
    context.commit("gateway_video", res.datas);
    //
  },

  // 获取区域信息数组
  async get_regional(context, payload) {
    let { data: res } = await this.$http(
      `/regionInfo/list/${context.state.gserial}`
    );

    context.commit("get_regional", res.datas);
  },
  // 获取区域下的设备
  async get_device(context, payload) {
    var obj = {
      gSerial: context.state.gserial,
      deviceRegion: payload
    };
    let { data: res } = await this.$http.post(
      "/device/listByRegion",
      Qs.stringify(obj)
    );
    // console.log(res);
    // console.log(obj);

    // if (res.status != 0) return;
    context.commit("get_device", res.datas);
  },
  // 获取区域下的阈值
  async get_threshold(context, payload) {
    let { data: res } = await this.$http.post(
      "/threshold/listByRegion",
      Qs.stringify({
        gSerial: context.state.gserial,
        deviceRegion: payload
      })
    );
    context.commit("get_threshold", res.datas);
  },
  // 获取设备下的定时信息
  async get_decice_time(context, device_id) {
    let { data: res } = await this.$http(`/timing/list/${device_id}`);
    context.commit("get_decice_time", res.datas);
  },
  // 获取站点下的农事管理
  async get_farming_list(context) {
    let { data: res } = await this.$http.put(`/farm/list/${context.state.sId}`);
    context.commit("get_farming_list", res.datas);
  },

  // 获取气象站 列表
  async get_weather(context) {
    if (!context.state.sId) return false;

    let { data: res } = await this.$http(
      `/collectorSingle/listCSBySId/${context.state.sId}`
    );
    console.log(res.datas);

    context.commit("get_weather", res.datas);
  },

  // 获取气象站下的元素 数据
  async get_weather_ele(context, serial) {
    if (!serial) return false;
    let { data: res } = await this.$http(`/data/realtimeSingle/${serial}`);
    // console.log(serial);
    // console.log(res);

    context.commit("get_weather_ele", res);
  },
  // 获取全屏下的 所有气象站实时数据
  async get_weather_ele_full(context, list) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      let { data: res } = await this.$http(
        `/data/realtimeSingle/${list[i].serial}`
      );
      if (!res.labels) {
        arr.push({ datas: [{ update_time: "" }], labels: [] });
        continue;
      }
      arr.push(res);
    }
    context.commit("get_weather_ele_full", arr);

    // console.log(arr);
  },
  // 获取气象站历史数据
  async get_weather_historical_data(context, form) {
    let { data: res } = await this.$http.post(
      "/data/listSingleDatasByRange",
      Qs.stringify(form)
    );
    context.commit("get_weather_historical_data", res);

    // console.log(res);
  }
};
