<template>
  <Card style="width:100%;height:50%" class="i_card ss_card">
    <p slot="title">
      <Icon size="20" type="ios-podium"/>实时数据
      <Icon class="contract" size="20" type="ios-expand" @click="modal_full"/>
    </p>
    <!-- <a href="#" slot="extra" @click.prevent="changeLimit"> -->
    <!-- <Icon type="ios-loop-strong"></Icon>Change -->

    <Select @on-change="select_cjq" slot="extra" v-model="model8" style="width:100%">
      <Option v-for="item in cjq_list" :value="item.addr" :key="item.id">{{ item.addr }}</Option>
      <!-- :label="item.id" -->
    </Select>
    <!-- </a> -->
    <ul class="data_ui">
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
          {{item.addr +'采集器 '+ cjq_data_fu[k].datas[0].update_time}}
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
    <Modal fullscreen v-model="modal2" footer-hide title="数据可视" width="1000">
      <!-- 选择项 -->
      <Row type="flex" :gutter="5">
        <Col span="4">
          <Select @on-change="addr_change" v-model="form_data.addr" style="width:100%">
            <Option v-for="item in cjq_list" :value="item.addr" :key="item.id">{{ item.addr }}</Option>
            <!-- :label="item.id" -->
          </Select>
        </Col>
        <Col span="6">
          <Select v-model="form_data.gogals" multiple style="width:100%">
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
          <Tooltip placement="bottom" content="勾选必选项后点击">
            <Button @click="query_data" type="primary" ghost>查询</Button>
          </Tooltip>
        </Col>
        <!-- <Col span style="width:100%;"></Col> -->
      </Row>
      <!-- <Icon @click="data_lock = !data_lock" class="back_query" size="20" type="md-arrow-round-back"></Icon> -->
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
import { mapState, mapActions } from "vuex";
import dateFtt from "../assets/lib/time.js";
import Qs from "qs";
export default {
  created() {
    // console.log(this.cjq_list);
  },
  // filters: {
  //   formdata: function(value) {
  //     // if (!value) return "";
  //     // value = value.toString();
  //     console.log(value);

  //     return value;
  //   }
  // },
  data() {
    return {
      randomMovieList: [],
      model8: "",
      // 当前网关
      gSerial: "NQT181126001",
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
        pageSize: ""

        // time: ["2019-08-10 00:00:00", "2019-08-20 00:00:00"]
      },
      // 隐藏选择项
      data_lock: true
    };
  },
  computed: {
    ...mapState(["cjq_list", "cjq_data"])
  },
  methods: {
    // 初始化地图
    init_map(ele_name, ele_arr, ele_time) {
      // var main = document.querySelector("#main");
      // console.log(main.offsetWidth);
      // console.log(main.offsetHeight);

      console.log(ele_arr);
      console.log(ele_name);
      console.log(ele_time);
      var myChart = echarts.init(document.getElementById("main"));
      // 清空图标实例 数据不遗留
      myChart.clear();
      var option = {
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
          data: ele_name
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ele_time

          // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: ele_arr
      };

      myChart.setOption(option);
    },
    // 选择采集器事件
    async addr_change(a) {
      console.log(a);
      console.log(this.cjq_data_fu);
      var obj = {
        gSerial: this.gSerial,
        collectorAddr: a
      };
      var { data: res } = await this.$http.post(
        "/data/realtime",
        Qs.stringify(obj)
      );
      console.log(res);
      this.ele_list = res.labels;
      this.form_data.gogals = [];
    },
    // 点击查询·按钮
    async query_data() {
      console.log(this.form_data);

      this.data_lock = false;
      // console.log(echarts);
      this.form_data.gSerial = this.gSerial;
      // this.form_data.gogals = this.form_data.gogals.join(",");
      var obj = { ...this.form_data };
      obj.gogals = this.form_data.gogals.join(",");
      let { data: res } = await this.$http.post(
        `/data/listDatasByRange`,
        Qs.stringify(obj)
      );
      // console.log(res);
      if (res.status != 0) return this.$Message.error(res.msg);
      var ele_name = [];
      var ele_arr = [];
      var ele_time = [];
      res.labels.forEach((item, index) => {
        ele_name.push(item.elementName);
        // ele_arr[index] = { name: item.name };
        var ele_obj = {
          data: []
        };
        ele_obj.name = item.elementName;
        ele_obj.type = "line";
        res.datas.forEach(item2 => {
          // console.log(item2);
          ele_obj.data.push(item2[item.elementSort]);
          ele_time.push(item2.update_time);
        });
        ele_arr.push(ele_obj);
      });
      // console.log(res);

      // console.log(ele_arr);
      // console.log(ele_name);
      // console.log(ele_time);

      this.init_map(ele_name, ele_arr, ele_time);
      ele_name = [];
      ele_arr = [];
      ele_time = [];
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

      // console.log(this.form_data.time);
    },
    // 数据可视化按钮点击
    visualization() {
      this.modal1 = false;
      this.modal2 = true;
      // 默认显示第一个 采集器的元素列表
      this.ele_list = this.cjq_data_fu[0].labels;
      // 默认 第一个 元素选择中
      this.form_data.gogals = this.cjq_data_fu[0].labels[0].elementSort;
      // 默认第一个采集器选中
      this.form_data.addr = this.cjq_list[0].addr;
      // console.log(this.ele_list);
    },
    // 折叠版变化
    coll_change(a) {
      // console.log(a);
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
          gSerial: this.gSerial,
          collectorAddr: this.cjq_list[i].addr
        };
        var { data: res } = await this.$http.post(
          "/data/realtime",
          Qs.stringify(obj)
        );
        console.log(obj);

        // console.log(res);

        res.labels.forEach(item2 => {
          item2.src = require(`../assets/img/${item2.elementId}.png`);
        });

        arr.push(res);
      }

      this.cjq_data_fu = [...arr];
      this.full_lock = true;
    },
    select_cjq(a) {
      // console.log(a);
      this.collector_data({
        gSerial: this.gSerial,
        collectorAddr: this.model8
      });

      // this.cjq_mr = this.cjq_mr;
    },

    // 发怂ajax 获取当前采集器下的实时数据
    // ...mapActions(['modal_full'])

    ...mapActions(["collector_data", "collector_data_full"]),

    async one_data(gSerial) {
      // console.log(gSerial, 11111111);

      this.model8 = this.cjq_list[0].addr;
      this.gSerial = gSerial;
      this.collector_data({ gSerial: gSerial, collectorAddr: this.model8 });
      // console.log(this.cjq_data);

      // console.log(a);
    }
  },

  created() {
    // setTimeout(() => {
    //   this.one_data();
    // }, 500);
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
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
  // float: right;
  // text-align: right;
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

