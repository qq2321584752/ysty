<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <span>"云上田野" 智能农业管理平台</span>
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
                  style="width:200px"
                >
                  <Option
                    v-for="item in cityList1"
                    :value="item.serial +''"
                    :key="item.id+''"
                  >{{ item.name }}</Option>
                </Select>
              </Col>

              <Col span push="5" class="user_info">
                <img src alt>
                <span>{{ user_info.username }}</span>
              </Col>
              <Col span push="8">
                <Button type="dashed" ghost>退出</Button>
              </Col>
            </Row>

            <!-- <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>Item 4
            </MenuItem>-->
          </div>
        </Menu>
      </Header>
      <Layout>
        <!-- <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>Item 1
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>Item 2
              </template>
              <MenuItem name="2-1">Option 1</MenuItem>
              <MenuItem name="2-2">Option 2</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>Item 3
              </template>
              <MenuItem name="3-1">Option 1</MenuItem>
              <MenuItem name="3-2">Option 2</MenuItem>
            </Submenu>
          </Menu>
        </Sider>-->
        <Layout :style="{padding: '0 10px 10px'}">
          <!-- <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Layout</BreadcrumbItem>
          </Breadcrumb>-->
          <Content :style="{padding: '0px', minHeight: '280px'}">
            <Row class="main" type="flex" :gutter="5">
              <Col span="7" class="left">
                <ss_data ref="ss_data"></ss_data>
              </Col>
              <Col span="10" class="mid">
                <ss_data></ss_data>
              </Col>
              <Col span="7" class="right">
                <ss_data></ss_data>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
// @ is an alias to /src
import ss_data from "../components//ss_data";
import { mapActions } from "vuex";
export default {
  components: {
    ss_data: ss_data
  },
  created() {
    this.one_data();
  },
  data() {
    return {
      cityList: [],
      model8: "",
      model7: "",
      cityList1: "",
      user_info: JSON.parse(window.sessionStorage.getItem("user_info")),
      // 当前站点id
      station_id: ""
    };
  },
  methods: {
    ...mapActions(["collector"]),
    // 选择网关
    select_gateway(a) {
      // this.model7 = a;
      if (!a) return false;
      this.$refs.ss_data.one_data(a);
    },
    // 获取网关下采集器
    async collector_fn() {
      // console.log(this.model7);

      let { data: res } = await this.$http(
        `/collector/listByGSerial/${this.model7}`
      );
      this.collector(res);
      this.$refs.ss_data.one_data(this.model7);

      // console.log(res);
    },
    // 站点选择变化
    async select_station(a) {
      if (!a) {
        return false;
      }
      // console.log(a);
      this.station_id = a;
      let obj = this.cityList.filter(item => {
        return item.id == a;
      });
      this.cityList1 = obj[0].gateWays;
      // 如果切换的站点下 没有网关 清除默认值
      if (!this.cityList1[0]) return (this.model7 = "");
      this.model7 = this.cityList1[0].serial + "";
      // 选择框变化时 获取当前网关下的采集器
      this.collector_fn();
    },
    // 首次加载
    async one_data() {
      let { data: res } = await this.$http(
        `/station/station_gateways/${this.user_info.id}`
      );
      this.cityList = res.datas;
      this.model8 = res.datas[0].id + "";
      this.cityList1 = this.cityList[0].gateWays;
      this.model7 = this.cityList1[0].serial + "";
      this.select_station(res.datas[0].id);

      // console.log(this.cityList1);
    }
  }
};
</script>

<style lang="less">
.user_info {
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
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.left {
  height: 30%;
}
</style>
