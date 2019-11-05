<template>
  <Card style="width:100%;" class="i_card weather_card">
    <p slot="title">
      <Icon size="20" type="ios-podium"/>实时数据
      <Icon @click="switcher" class="swap select_cjq" type="ios-swap"/>
      <Icon class="contract" size="20" type="ios-expand" @click="modal_full"/>
    </p>

    <Select
      class="select_cjq"
      @on-change="select_cjq"
      slot="extra"
      v-model="model8"
      style="width:100%"
    >
      <Option v-for="item in weather_list" :value="item.serial" :key="item.id">{{ item.name }}</Option>
      <!-- :label="item.id" -->
    </Select>
    <Spin fix v-if="loading_mag">暂无数据查看...</Spin>
    <ul class="data_ui">
      <!-- <p v-if="text_mag">当前采集器暂无实时数据查看</p> -->
      <li :key="key" v-for="(item,key) in weather_ele_list.labels">
        <div class="data_box">
          <!-- {{item.src}} -->
          <img :src="item.src" alt>
          <div>
            <p>{{item.elementName}}</p>
            <p>{{weather_ele_list.datas[0][item.elementSort] +item.elementUnit }}</p>
            <!-- {{weather_list}} -->
          </div>
        </div>
      </li>
    </ul>
    <!-- 当前实时数据弹出框 -->
    <Modal v-model="modal1" footer-hide title="实时数据" width="800">
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span>
          <Button @click="visualization" size="small" class="data_btn" ghost type="info">数据可视化</Button>
        </Col>
      </Row>
      <!-- {{weather_list}} -->
      <Collapse v-if="full_lock" @on-change="coll_change" simple>
        <Panel :key="k" v-for="(item,k) in weather_list" :name="item.name+''">
          {{item.name +'气象站 '+ weather_ele_list_full[k].datas[0].update_time}}
          <!-- {{weather_ele_list}} -->
          <div slot="content">
            <!-- {{cjq_data_fu[k].labels}} -->
            <ul class="data_ui_full data_ui">
              <li :key="key" v-for="(item2,key) in weather_ele_list_full[k].labels">
                <div class="data_box">
                  <img :src="item2.src" alt>
                  <div>
                    <p>{{item2.elementName}}</p>
                    <p>{{weather_ele_list_full[k].datas[0][item2.elementSort] +item2.elementUnit }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Panel>
      </Collapse>
    </Modal>
    <!-- 全屏数据可 弹出框 -->
    <Modal class="full_dialog" fullscreen v-model="modal2" footer-hide title="数据可视" width="1000">
      <!-- 选择项 -->
      <Row type="flex" :gutter="5">
        <Col span="4">
          <Select @on-change="addr_change" v-model="form_data.serial" style="width:100%">
            <Option v-for="item in weather_list" :value="item.serial" :key="item.id">{{ item.name }}</Option>
            <!-- :label="item.id" -->
          </Select>
        </Col>
        <Col span="6">
          <!-- multiple -->
          <Select v-model="form_data.gogals" style="width:100%">
            <Option
              v-for="(item,k) in ele_list"
              :value="item.elementSort"
              :key="item.elementId + k"
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
          <Button @click="clear_form_data" style="margin-left:10px" type="error" ghost>重置</Button>
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

export default {
  data() {
    return {
      // 选择气象站默认值
      model8: "",
      // 有没有数据
      loading_mag: false,
      // 实时数据弹出层
      modal1: false,
      // 全屏点击
      full_lock: false,
      // 图表弹出框
      modal2: false,
      // 默认第一个被选中的 labels
      ele_list: [],
      // 表单数据存放
      form_data: {
        time: ["2019-03-10 00:00:00", "2019-03-31 00:00:00"]
      }
    };
  },
  created() {
    this.one_data();
  },
  computed: {
    ...mapState([
      "weather_list",
      "weather_ele_list",
      "weather_ele_list_full",
      "weather_historical_data_list"
    ])
  },
  methods: {
    ...mapActions([
      "get_weather",
      "get_weather_ele",
      "get_weather_ele_full",
      "get_weather_historical_data"
    ]),
    ...mapMutations(["cjq_qxz_negation"]),
    // 重置表单点击
    clear_form_data() {
      // 清除表单预选项
      this.form_data = {};
    },
    // 折叠面板切换事件
    coll_change() {},
    // 选择查询时间事件
    time_se() {},
    // 选择框变化
    async addr_change(a) {
      // 清除表单时 触发 change事件  在这里打断
      if (!a) return;
      await this.get_weather_ele(a);
      // 如果获取来的 数据 里边 没有 实时元素数据
      if (this.weather_ele_list.status != 0) {
        // 清除默认选中 的默认值
        this.form_data.gogals = "";
        // 清空 选择项
        this.ele_list = [];
        return;
      }
      //
      // 将有的 元素 遍历出来 至下拉列表
      this.ele_list = this.weather_ele_list.labels;
      // 默认选中第一个元素
      this.form_data.gogals = this.ele_list[0].elementSort;
    },
    // 点击查询按钮
    async query_data() {
      // this.form_data.startTime = this.form_data.time[0]
      // 引进格式化时间方法
      var dateFtt1 = dateFtt.dateFtt;
      // 格式化开始时间
      this.form_data.startTime = dateFtt1(
        "yyyy-MM-dd hh:mm:ss",
        new Date(this.form_data.time[0])
      );
      // 格式化结束时间
      this.form_data.endTime = dateFtt1(
        "yyyy-MM-dd hh:mm:ss",
        new Date(this.form_data.time[1])
      );
      // 执行actions 获取 气象站历史数据
      await this.get_weather_historical_data(this.form_data);
      //
      // 判断 数据是否请求回来
      if (!this.weather_historical_data_list.datas)
        return this.$Message.warning("该时间段内暂无数据");
      var arr_update_time = [];
      var arr_ele_data = [];
      this.weather_historical_data_list.datas.forEach(item => {
        // 循环取出时间
        arr_update_time.push(item.update_time);
        // 对应时间的数据
        arr_ele_data.push(
          item[this.weather_historical_data_list.labels[0].elementSort]
        );
      });

      // 初始化地图
      this.init_map(
        arr_ele_data,
        arr_update_time,
        this.weather_historical_data_list.labels[0].elementName +
          this.weather_historical_data_list.labels[0].elementUnit
      );
    },
    // 数据可视化点击
    visualization() {
      //

      this.modal1 = false;
      this.modal2 = true;
      // 默认显示第一个 采集器的元素列表
      this.ele_list = this.weather_ele_list_full[0].labels;
      // 默认第一个采集器选中
      this.form_data.serial = this.weather_list[0].serial;
      // 默认 第一个 元素选择中
      this.form_data.gogals = this.weather_ele_list_full[0].labels[0].elementSort;
    },
    // 切换气象站
    async select_cjq(val) {
      await this.get_weather_ele(val);
      //
      if (!this.weather_ele_list.labels) {
        this.loading_mag = true;
      } else {
        this.loading_mag = false;
      }
    },
    // 切换为采集器
    switcher() {
      this.cjq_qxz_negation(true);
    },
    async modal_full() {
      this.modal1 = true;
      await this.get_weather_ele_full(this.weather_list);

      //
      this.full_lock = true;
    },
    async one_data() {
      // 获取所有气象站
      await this.get_weather();
      // return;

      // 给选择器默认第一个 站 选中

      if (this.weather_list.length == 0) {
        this.loading_mag = true;
        return false;
      }
      this.model8 = this.weather_list[0].serial;
      // 获取气象站下的 元素实时数据
      await this.get_weather_ele(this.model8);
      //
      if (!this.weather_ele_list.labels) {
        this.loading_mag = true;
      } else {
        this.loading_mag = false;
      }
    },
    // 初始化数据图表
    init_map(arr_2, arr_2_time, unit) {
      var myChart = echarts.init(document.getElementById("main"));

      myChart.clear();
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
            end: 50
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
              color: "#3397f3"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#3395f0"
                },
                {
                  offset: 1,
                  color: "#33f0c1"
                }
              ])
            },
            data: arr_2
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style lang='less' scoped>
.swap {
  cursor: pointer;
}
.select_cjq {
  line-height: 20px;
  margin-left: 8px;
  position: absolute;
  z-index: 9;
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
      // height: 50%;
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

.data_btn {
  margin-bottom: 5px;
}
</style>
