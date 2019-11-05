<template>
  <Card style="width:100%;" class="i_card ss_card">
    <p slot="title">
      <Icon size="20" type="ios-podium"/>实时数据
      <Icon @click="switcher" class="swap select_cjq" type="ios-swap"/>
      <Icon class="contract" size="20" type="ios-expand" @click="modal_full"/>
    </p>
    <Spin v-if="text_mag" fix>当前采集器暂无实时数据查看...</Spin>
    <!-- <a href="#" slot="extra" @click.prevent="changeLimit"> -->
    <!-- <Icon type="ios-loop-strong"></Icon>Change -->

    <Select
      class="select_cjq"
      @on-change="select_cjq"
      slot="extra"
      v-model="model8"
      style="width:100%"
    >
      <Option v-for="item in cjq_list" :value="item.addr" :key="item.id">{{ item.name }}</Option>
      <!-- :label="item.id" -->
    </Select>
    <!-- </a> -->
    <ul class="data_ui">
      <!-- <p v-if="text_mag">当前采集器暂无实时数据查看</p> -->
      <li :key="key" v-for="(item,key) in cjq_data.labels">
        <div class="data_box">
          <!-- {{item.src}} -->
          <img :src="item.src" alt>
          <div>
            <p>{{item.elementName}}</p>
            <p>{{cjq_data.datas[0][item.elementSort] +item.elementUnit }}</p>
          </div>
        </div>
      </li>
    </ul>
    <!-- draggable 对话框可拖动属性 -->
    <!-- 当前实时数据弹出框 -->
    <Modal v-model="modal1" footer-hide title="实时数据" width="800">
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span>
          <Button @click="visualization" size="small" class="data_btn" ghost type="info">数据可视化</Button>
        </Col>
      </Row>
      <Collapse v-if="full_lock" @on-change="coll_change" simple>
        <Panel :key="k" v-for="(item,k) in cjq_list" :name="item.addr+''">
          {{item.name +'采集器 '+ cjq_data_fu[k].datas[0].update_time}}
          <div slot="content">
            <!-- {{cjq_data_fu[k].labels}} -->
            <ul class="data_ui_full data_ui">
              <li :key="key" v-for="(item2,key) in cjq_data_fu[k].labels">
                <div class="data_box">
                  <img :src="item2.src" alt>
                  <div>
                    <p>{{item2.elementName}}</p>
                    <p>{{cjq_data_fu[k].datas[0][item2.elementSort] +item2.elementUnit }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Panel>
      </Collapse>
    </Modal>
    <!-- 点击弹出数据可视化选项 -->
    <Modal class="full_dialog" fullscreen v-model="modal2" footer-hide title="数据可视" width="1000">
      <!-- 选择项 -->
      <Row type="flex" :gutter="5">
        <Col span="4">
          <Select @on-change="addr_change" v-model="form_data.addr" style="width:100%">
            <Option v-for="item in cjq_list" :value="item.addr" :key="item.id">{{ item.name }}</Option>
            <!-- :label="item.id" -->
          </Select>
        </Col>
        <Col span="6">
          <!-- multiple -->
          <Select v-model="form_data.gogals" style="width:100%">
            <Option
              v-for="item in ele_list"
              :value="item.elementSort"
              :key="item.elementId"
            >{{ item.elementName }}</Option>
          </Select>
        </Col>
        <Col span="8">
          <!-- 选择时间: -->
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="time_se"
            v-model="form_data.time "
            type="datetimerange"
            placeholder="选择开始与结束时间"
            style="width: 100%"
          ></DatePicker>
          <br>
        </Col>
        <Col span :offset="2">
          <!-- <Tooltip placement="bottom" content="勾选必选项后点击"> -->
          <Button @click="query_data" type="primary" ghost>查询</Button>
          <!-- </Tooltip> -->
        </Col>
        <!-- <Col span style="width:100%;"></Col> -->
      </Row>
      <!-- <Icon @click="data_lock = !data_lock" class="back_query" size="20" type="md-arrow-round-back"></Icon> -->
      <!-- <div id="container" style="min-width:400px;height:400px;position: relative"></div> -->
      <div id="main" style="width: 100%;height:95%;"></div>
      <!-- 图表显示 -->
      <!-- <Row v-show="!data_lock" style="width:100%;">
        <Col class="echarts_col" style="width:100%;"></Col>
      </Row>-->
      <!-- <template v-show="!data_lock">
        <Icon
          @click="data_lock = !data_lock"
          class="back_query"
          size="20"
          type="md-arrow-round-back"
      />-->
      <!-- </template> -->
    </Modal>
  </Card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import dateFtt from "../assets/lib/time.js";
import Qs from "qs";
export default {
  created() {},
  mounted() {
    this.one_data();
  },
  // filters: {
  //   formdata: function(value) {
  //     // if (!value) return "";
  //     // value = value.toString();
  //

  //     return value;
  //   }
  // },
  data() {
    return {
      randomMovieList: [],
      model8: "",
      // 当前网关
      gSerial: "", //NQT181126001
      // cjq_mr: ""
      // 实时数据弹出框
      modal1: false,
      // 所有采集器的实时数据
      cjq_data_fu: [],
      // 全屏锁
      full_lock: false,
      // 数据可视开关
      modal2: false,
      // 多选框的数据数组
      ele_list: [],
      // 当前选中的元素数组
      model_se_ele: [],
      // 数据可视的采集器选择
      model8_ks: [],
      // 时间选择
      form_data: {
        page: "",
        pageSize: "",

        time: ["2019-03-10 00:00:00", "2019-04-01 00:00:00"]
      },
      // 隐藏选择项
      data_lock: true,
      text_mag: false
    };
  },
  computed: {
    ...mapState(["cjq_list", "cjq_data", "gserial", "cjq_qxz"])
  },
  methods: {
    ...mapActions([
      "collector_data",
      "collector_data_full",
      "collector",
      "get_weather"
    ]),
    ...mapMutations(["cjq_list_clear", "cjq_qxz_negation"]),
    switcher() {
      // this.get_weather();
      this.cjq_qxz_negation(false);
    },
    // 初始化地图
    init_map(arr_2, arr_2_time, unit) {
      var myChart = echarts.init(document.getElementById("main"));

      myChart.clear();

      // var base = +new Date(1968, 9, 3);
      // var oneDay = 24 * 3600 * 1000;
      // var date = [];

      // var data = [Math.random() * 300];

      // for (var i = 1; i < 20000; i++) {
      //   var now = new Date((base += oneDay));
      //   date.push(
      //     [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
      //   );
      //   data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      // }

      var option = {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          left: "center",
          text: "大数据量面积图"
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: arr_2_time
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"]
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: unit,
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(255, 66, 131)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: arr_2
          }
        ]
      };
      myChart.setOption(option);
    },
    // 初始化地图
    // init_map(ele_name, ele_arr, ele_time) {
    //   // var main = document.querySelector("#main");
    //   var myChart = echarts.init(document.getElementById("main"));
    //   // 清空图标实例 数据不遗留
    //   myChart.clear();
    //   var option = {
    //     title: {
    //       text: "折线图堆叠"
    //     },
    //     tooltip: {
    //       trigger: "axis"
    //     },
    //     legend: {
    //       // data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
    //       data: ele_name
    //     },
    //     grid: {
    //       left: "3%",
    //       right: "4%",
    //       bottom: "3%",
    //       containLabel: true
    //     },
    //     toolbox: {
    //       feature: {
    //         saveAsImage: {}
    //       }
    //     },
    //     xAxis: {
    //       type: "category",
    //       boundaryGap: false,
    //       data: ele_time

    //       // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    //     },
    //     yAxis: {
    //       type: "value"
    //     },
    //     series: ele_arr
    //   };

    //   myChart.setOption(option);
    // },
    // 选择采集器事件
    async addr_change(a) {
      //
      //
      var obj = {
        gSerial: this.gserial,
        collectorAddr: a
      };
      var { data: res } = await this.$http.post(
        "/data/realtime",
        Qs.stringify(obj)
      );

      this.ele_list = res.labels;
      this.form_data.gogals = [];
    },
    // 点击查询·按钮
    async query_data() {
      // this.init_map();
      // return;
      this.time_se(this.form_data.time);
      this.data_lock = false;
      //
      this.form_data.gSerial = this.gSerial || this.gserial;
      // this.form_data.gogals = this.form_data.gogals.join(",");
      var obj = { ...this.form_data };
      obj.gogals = this.form_data.gogals;
      let { data: res } = await this.$http.post(
        `/data/listDatasByRange`,
        Qs.stringify(obj)
      );
      // console.log(obj);
      // console.log(res);

      if (res.status != 0) return this.$Message.error(res.msg);
      var arr_2 = [];
      var arr_2_time = [];
      res.datas.forEach(item => {
        // 数据产生时间 和 该时间的数据 分别两个数组存放
        arr_2.push(item[res.labels[0].elementSort]);
        arr_2_time.push(item.update_time);
      });
      this.init_map(
        arr_2,
        arr_2_time,
        res.labels[0].elementName + res.labels[0].elementUnit
      );
      // ===========================
      // var ele_name = [];
      // var ele_arr = [];
      // var ele_time = [];
      // res.labels.forEach((item, index) => {
      //   ele_name.push(item.elementName);
      //   // ele_arr[index] = { name: item.name };
      //   var ele_obj = {
      //     data: []
      //   };
      //   ele_obj.name = item.elementName;
      //   ele_obj.type = "line";
      //   res.datas.forEach(item2 => {
      //     //
      //     ele_obj.data.push(item2[item.elementSort]);
      //     ele_time.push(item2.update_time);
      //   });
      //   ele_arr.push(ele_obj);
      // });
      //

      //
      //
      //
    },
    // 选择时间事件
    time_se(a) {
      var dateFtt1 = dateFtt.dateFtt;
      this.form_data.startTime = a[0];
      this.form_data.endTime = a[1];

      var a = this.form_data.time;
      // var b = new Date(a[0]);
      // var c = new Date(a[1]);
      var b = dateFtt1("yyyy-MM-dd hh:mm:ss", new Date(a[0]));
      var c = dateFtt1("yyyy-MM-dd hh:mm:ss", new Date(a[1]));
      this.form_data.time[0] = b;
      this.form_data.time[1] = c;
      this.form_data.time = [...this.form_data.time];

      //
    },
    // 数据可视化按钮点击
    visualization() {
      this.modal1 = false;
      this.modal2 = true;
      // 默认显示第一个 采集器的元素列表
      this.ele_list = this.cjq_data_fu[0].labels;
      // 默认第一个采集器选中
      this.form_data.addr = this.cjq_list[0].addr;
      // 默认 第一个 元素选择中

      this.form_data.gogals = this.cjq_data_fu[0].labels[0].elementSort;

      //
    },
    // 折叠版变化
    coll_change(a) {
      //
      // this.collector_data_full({
      //   gSerial: this.gSerial,
      //   collectorAddr: a[0]
      // });
    },
    // 全屏按钮点击
    async modal_full() {
      this.modal1 = true;

      var arr = [];

      // this.cjq_list.forEach(async item => {
      for (var i = 0; i < this.cjq_list.length; i++) {
        // this.cjq_data_fu.push({});
        var obj = {
          gSerial: this.gserial,
          collectorAddr: this.cjq_list[i].addr
        };
        var { data: res } = await this.$http.post(
          "/data/realtime",
          Qs.stringify(obj)
        );

        // this.collector_data_full(obj);

        if (!res.labels) {
          arr.push({ datas: [{ update_time: "" }], labels: [] });
          continue;
        }

        res.labels.forEach(item2 => {
          item2.src = require(`../assets/img/${item2.elementId}.png`);
        });

        arr.push(res);
      }
      //

      this.cjq_data_fu = [...arr];

      this.full_lock = true;
    },
    async select_cjq(a) {
      //
      await this.collector_data({
        gSerial: this.gSerial || this.gserial,
        collectorAddr: this.model8
      });
      //

      if (!this.cjq_data.labels) {
        this.text_mag = true;
      } else {
        this.text_mag = false;
      }

      // this.cjq_mr = this.cjq_mr;
    },

    // 发怂ajax 获取当前采集器下的实时数据
    // ...mapActions(['modal_full'])

    async one_data(gSerial) {
      // let { data: res } = await this.$http(
      //   `/collector/listByGSerial/${gSerial}`
      // );
      //

      await this.collector();
      // setTimeout(() => {
      if (this.cjq_list.length == 0) {
        // this.cjq_list = [];
        this.cjq_list_clear();
        this.model8 = "";

        return this.$Message.warning("暂无采集器信息查看");
      }
      //

      // if (!this.cjq_lis) return this.$Message.warning("该网关暂无采集器信息");
      // });
      this.model8 = this.cjq_list[0].addr;
      this.gSerial = gSerial;
      await this.collector_data({
        gSerial: gSerial || this.gserial,
        collectorAddr: this.model8
      });

      if (!this.cjq_data.labels) {
        this.text_mag = true;
      } else {
        this.text_mag = false;
      }
      //

      //

      //
    }
  }
};
</script>

<style lang="less" scoped>
.swap {
  cursor: pointer;
}
.select_cjq {
  position: absolute;
  z-index: 9;
  line-height: 20px;
  margin-left: 8px;
}
// .ivu-modal-body,
// .ivu-modal-content {
//   height: 100%;
//   width: 100%;
// }
// #main {
//   position: relative;
// }
/* eslint-disable */
.back_query {
  position: relative;
  top: -10px;
  left: 0px;
  cursor: pointer;
}
.data_btn {
  margin-bottom: 5px;
}

.ivu-card-extra {
  width: 20% !important;
  margin-right: 5px !important;
}

.data_ui {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  li {
    width: 50%;
    // height: 100%;
    // border: 1px solid #000;
    // height: 50%;
    img {
      // width: 100%;
    }
  }
  .data_box {
    display: flex;
    padding: 15px;
    box-sizing: border-box;
    // width: 100%;
    // height: 100%;
    img {
      // flex: 1;
      width: 30%;
      height: 100%;
      // margin-bottom: -5px;
    }
    div {
      // flex: 1;
      text-align: center;
      width: 100%;
      color: #8d9191;
    }
  }
}
.data_ui_full {
  li {
    width: 33%;
  }
}
.i_card {
  .ivu-card-body {
    overflow: auto;
    height: 73% !important;
  }
}
</style>

