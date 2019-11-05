<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="f_box">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <Menu mode="horizontal" active-name="1">
          <div class="layout-logo">
            <span class="title_">"云上田野" 智能农业管理平台</span>
          </div>
          <div class="layout-nav">
            <Row type="flex" :gutter="5">
              <Col span="6">
                <Select
                  @on-change="select_station"
                  class="select_station"
                  v-model="model8"
                  clearable
                  style="width:200px"
                >
                  <Option
                    v-for="item in cityList"
                    :value="item.id+''"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span="6">
                <Select
                  class="select_station"
                  @on-change="select_gateway"
                  v-model="model7"
                  clearable
                  style="width:100%"
                >
                  <Option
                    v-for="item in cityList1"
                    :value="item.serial +''"
                    :key="item.id+''"
                  >{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span push="2" class="Weather_box">
                <!-- <Button type="text" ghost>天气</Button> -->
                <Tooltip content="查看天气状况" placement="top">
                  <Icon
                    @click="weather_btn('')"
                    class="weather_btn"
                    type="ios-partly-sunny-outline"
                  />
                </Tooltip>
              </Col>
              <Col span push="3" class="user_info">
                <img src alt>
                <span>{{ user_info.username }}</span>
              </Col>

              <Col span push="4">
                <Button type="dashed" @click="exit_" ghost>退出</Button>
              </Col>
            </Row>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Layout :style="{padding: '0 10px 10px'}">
          <!-- <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Layout</BreadcrumbItem>
          </Breadcrumb>-->
          <Content :style="{padding: '0px', minHeight: '280px'}">
            <Row class="main" type="flex" :gutter="5">
              <Col span="7" class="left">
                <ss_data v-if="cjq_qxz" ref="ss_data"></ss_data>
                <weather v-if="!cjq_qxz" ref="weather"></weather>
                <warning ref="warning"></warning>
              </Col>
              <Col span="10" class="mid">
                <!-- <ss_data></ss_data> -->
                <map1 @map_serial="map_serial" ref="map1"></map1>
                <camera ref="camera"></camera>
              </Col>
              <Col span="7" class="right">
                <!-- <ss_data></ss_data> -->
                <device_c ref="device_c"></device_c>
                <agricultural ref="agricultural"></agricultural>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <!-- 天气弹出框 -->
    <Modal
      class="w_box"
      footer-hide
      v-model="weather_dialog"
      :title="'天气概况'+ '('+w_obj.city+')'"
      width="600"
    >
      <div class="w_ul">
        <!-- <li>{{w_obj.city}}</li> -->
        <div class="li_1">
          <span class="qw">{{ w_obj.temp }}°</span>
          <i>{{w_obj.weather}}</i>
          <!-- <Button type="primary" shape="circle">{{ w_obj.aqi.quality }}</Button> -->
          <Poptip
            trigger="hover"
            :content="'PM2.5 :'+aqi.ipm2_5 +'-----' +'PM10 :' + aqi.ipm10"
            :title="'空气质量指数 '+aqi.aqi + aqi.quality"
            placement="top-start"
          >
            <div class="quality">{{ aqi.quality }}</div>
          </Poptip>
          <Button
            v-show="!cascader_lock"
            @click="query_city"
            style="margin-left:20px;"
            size="small"
            type="default"
            ghost
          >切换</Button>
          <Cascader
            @on-change="query_city_cascader"
            v-show="cascader_lock"
            class="query_city_cascader"
            trigger="hover"
            :data="city_list"
            v-model="query_city_res"
          ></Cascader>
          <div class="other_data">
            <div>
              <Icon type="ios-rewind-outline"/>
              {{w_obj.winddirect+''+ w_obj.windpower}}
            </div>
            <div>
              <Icon type="ios-water-outline"/>
              湿度{{w_obj.humidity}}%
            </div>
            <div>
              <Icon type="ios-compass-outline"/>
              气压{{w_obj.pressure}}hPa
            </div>
          </div>
        </div>
        <div class="detail_box">
          <img :src="w_obj.icon">
        </div>
      </div>

      <div class="seven_data">
        <ul>
          <!-- 321 -->
          <br>
          <li :key="k" v-for="(item,k) in w_obj.daily">
            <!-- 123 -->
            <p>{{ item.week }}</p>
            <p>{{ item.date }}</p>
            <p class="w_p">{{ item.day.weather }}</p>
            <img :src="item.icon" alt>
            <p>{{ item.day.temphigh }}°</p>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import ss_data from "../components/ss_data";
import warning from "../components/warning";
import map from "../components/map";
import camera from "../components/camera";
import device_c from "../components/device_c";
import agricultural_card from "../components/agricultural";
import weather from "../components/weather";

import arr from "../assets/lib/city.js";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    ss_data: ss_data,
    warning: warning,
    map1: map,
    camera: camera,
    device_c: device_c,
    agricultural: agricultural_card,
    weather: weather
  },
  created() {
    this.one_data();
    this.city_list = arr.arr;
  },
  mounted() {
    // this.fn();
  },
  data() {
    return {
      cityList: [],
      model8: "",
      model7: "",
      cityList1: "",
      user_info: JSON.parse(window.sessionStorage.getItem("user_info")),
      // 当前站点id
      station_id: "",
      weather_dialog: false,
      // 天气对象
      w_obj: {},
      // 空气信息
      aqi: {},
      // 级联锁
      cascader_lock: false,
      // 级联val
      query_city_res: [],
      // 城市列表
      city_list: []
    };
  },
  computed: {
    ...mapState(["cjq_qxz"])
  },
  methods: {
    ...mapActions(["collector"]),
    ...mapMutations(["gserial", "s_id"]),
    // 退出事件
    exit_() {
      this.$Modal.confirm({
        title: "退出？",
        content: "<p>将跳转到至登录页面</p>",
        onOk: () => {
          // this.$Message.info("Clicked ok");
          window.sessionStorage.removeItem("token");
          location.href = "/";
        },
        onCancel: () => {
          this.$Message.info("Clicked cancel");
        }
      });
    },
    // 级联选择 事件
    query_city_cascader(a) {
      //

      this.weather_btn(a[1]);
      this.cascader_lock = false;
    },
    // 切换城市按钮
    async query_city() {
      this.cascader_lock = true;
    },
    // 天气按钮点击
    async weather_btn(city) {
      var city_ = "邯郸";
      if (city) {
        city_ = city;
      }
      this.weather_dialog = true;
      let res = await this.$jsonp("https://api.jisuapi.com/weather/query", {
        appkey: "d16f0cacaee7d4ce",
        city: city_
      });

      this.w_obj = res.result;
      this.w_obj.icon = require(`../assets/img/weather_img/weathercn02/${
        this.w_obj.img
      }.png`);
      this.w_obj.daily.forEach(item => {
        item.icon = require(`../assets/img/weather_img/weathercn02/${
          item.day.img
        }.png`);
      });
      this.aqi = res.result.aqi;
      // console.log(this.aqi, "aqi");
      // console.log(this.w_obj, "w-obj");

      //
    },
    map_serial(a) {
      this.model7 = a;
      this.select_gateway(a);
    },
    // 选择网关
    select_gateway(a) {
      // this.model7 = a;
      if (!a) return false;
      this.gserial(a);

      // this.$refs.ss_data.one_data(a);
      // 启动子组件
      this.fn();

      // warning
    },
    // 获取网关下采集器
    // async collector_fn() {
    //   //

    //   let { data: res } = await this.$http(
    //     `/collector/listByGSerial/${this.model7}`
    //   );
    //   this.collector(res);
    //   this.$refs.ss_data.one_data(this.model7);

    //   //
    // },
    // 站点选择变化
    async select_station(a) {
      if (!a) {
        return false;
      }

      //
      this.station_id = a;
      this.s_id(this.model8);

      let obj = this.cityList.filter(item => {
        return item.id == a;
      });
      this.cityList1 = obj[0].gateWays;
      // 如果切换的站点下 没有网关 清除默认值
      if (!this.cityList1[0]) return (this.model7 = "");
      this.model7 = this.cityList1[0].serial + "";
      // 选择框变化时 获取当前网关下的采集器
      // this.collector_fn();

      // this.one_data()

      this.select_gateway(this.cityList1[0].serial);
    },
    // 首次加载
    async one_data() {
      // 开启加载动画
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18
              }
            }),
            h("div", "Loading")
          ]);
        }
      });
      let { data: res } = await this.$http(
        `/station/station_gateways/${this.user_info.id}`
      );
      this.cityList = res.datas;
      this.model8 = res.datas[0].id + "";
      this.s_id(this.model8);
      this.cityList1 = this.cityList[0].gateWays;
      this.model7 = this.cityList1[0].serial + "";
      //

      // this.select_station(res.datas[0].id);

      await this.gserial(this.cityList1[0].serial);
      //
      // 启动子组件
      this.fn();
      //
    },
    async fn() {
      // 调用组件方法加载第一次报警信息

      if (this.cjq_qxz) {
        await this.$refs.ss_data.one_data();
      } else {
        await this.$refs.weather.one_data();
      }
      await this.$refs.warning.one_data();
      await this.$refs.map1.init_map(this.cityList1);
      await this.$refs.camera.one_data();
      await this.$refs.device_c.one_data();
      await this.$refs.agricultural.one_data();
      // 等待组件方法执行完毕之后 关闭加载动画
      this.$Spin.hide();
    }
  }
};
</script>

<style lang="less" >
// .ivu-layout-header:hover {
//   box-shadow: 0px 0px 55px 3px rgb(47, 179, 202);
// }
@blue: 10px;
@blue2: 20px;
.title_ {
  transition: all 0.5s;
  text-shadow: 1px 1px #080808cc, 2px 2px #000000cc, 3px 3px #000000cc,
    4px 4px #000000cc, 5px 5px #000000cc;
}
.f_box {
  perspective: 1000px;

  width: 20px;
  height: 20px;
  // background-color: #fff;
  position: absolute;
  top: 50%;
  left: 35px;
  transform: translate(-50%, -50%);
  // transform-style: preserve-3d; /*定义3d转换*/
  // perspective: 1000px;
  // position: relative;
  ul {
    animation: rotate 8s infinite; /*animation：动画名字 时长 无限循环 线性速度（匀速）*/
    width: 100%;
    height: 100%;
    transform-style: preserve-3d; /*定义3d转换*/
    &:hover li {
      box-shadow: 0px 0px 15px 3px rgb(237, 241, 238);
    }
    li {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      line-height: 20px;
      box-shadow: 0px 0px 3px 1px rgb(238, 243, 239);
      transition: all 0.5s;
      background-color: rgba(65, 235, 220, 0.582);
      // animation: colors_ 8s infinite; /*animation：动画名字 时长 无限循环 线性速度（匀速）*/
    }

    :nth-child(1) {
      transform: translateZ(@blue);
      // background-color: #68b1e2;
    }
    :nth-child(2) {
      // transform: translateZ(-10px);
      transform: translateZ(-@blue);
      // background-color: #f5e081;
    }
    :nth-child(3) {
      transform: rotateY(90deg) translateZ(@blue);
      // background-color: #f1ff74;
    }
    :nth-child(4) {
      transform: rotateY(90deg) translateZ(-@blue);
      // background-color: #2fe48f;
    }
    :nth-child(5) {
      transform: rotateX(90deg) translateZ(-@blue);
      // background-color: #3aecde;
    }
    :nth-child(6) {
      transform: rotateX(90deg) translateZ(@blue);
      // background-color: #f07777;
    }
  }
}
// @keyframes colors_ {
//   10% {
//     color: rgb(209, 131, 79);
//   }
//   30% {
//     color: rgb(63, 175, 132);
//   }
//   60% {
//     color: rgb(63, 166, 175);
//   }
//   90% {
//     color: rgb(63, 166, 175);
//   }
//   100% {
//     color: rgb(55, 124, 156);
//   }
// }
/*动画效果，也可以以百分百的方式。默认逆时针的方向旋转。*/
@keyframes rotate {
  from {
    transfrom: rotateY(0deg) rotateX(0deg);
    // background-color: rgb(30, 133, 124);
  }
  to {
    transform: rotateY(360deg) rotateX(360deg);
    // background-color: rgba(81, 226, 214, 0.589);
  }
}
// .horizontal {
//   position: relative;
// }
.query_city_cascader {
  display: inline-block;
  margin-left: 15px;
  width: 50%;
}

.seven_data {
  color: #fafafa;
  margin-top: 50px;
  // height: 300px;
  ul {
    display: flex;
    li {
      text-align: center;
      line-height: 28px;
      padding: 0px 6px;
      img {
        width: 70%;
      }
    }
  }
}

.other_data {
  display: flex;
  font-size: 15px;
  margin-top: 15px;
  div {
    margin-right: 10px;
  }
}

.detail_box {
  // height: 100%;
  display: flex;
  // margin-left: 30px;
  position: absolute;
  right: 60px;
  p {
    margin-top: 28px;
  }
}
.w_ul {
  display: flex;
  align-items: flex-end;
  li {
    height: 50px;
  }
  .li_1 {
    .qw {
      font-size: 40px;
    }
    i {
      font-size: 16px;
    }
    .quality {
      cursor: pointer;
      border: 1px solid rgb(246, 241, 242);
      // background-color: rgb(163, 215, 101);
      border-radius: 5px;
      margin-left: 10px;
      padding: 2px;
      font-size: 12px;
      display: inline-block;
    }
  }
}

.weather_btn {
  font-size: 20px;
  cursor: pointer;
  transition: 1s all;
  &:hover {
    transform: scale(1.5, 1.5);
  }
}
.user_info,
.weather_btn {
  color: #fff;
}
.select_station {
  width: 100% !important;
}
.ivu-layout,
.layout,
.main {
  height: 100%;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  // width: 100px;
  padding: 5px 8px;
  line-height: 20px;
  // height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
  color: #fff;
  &:hover .title_ {
    // color: rgb(231, 16, 16);
    // transform: translateZ(50px);
    text-shadow: 1px 1px #e0dcdccc, 2px 2px #9c9a9acc, 3px 3px #9b9b9bcc,
      4px 4px #a8a5a5cc, 5px 5px #969494cc;
  }
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.left,
.mid,
.right {
  height: 100%;
}
</style>
