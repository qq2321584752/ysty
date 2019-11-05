<template>
  <Card class="i_card device_card" style="width:100%;">
    <p slot="title">
      <Icon size="20" type="md-switch"/>设备控制
      <Icon class="contract" size="20" type="ios-expand" @click="modal_full"/>
    </p>
    <Spin v-if="device_lock" fix>加载中...</Spin>
    <Select
      class="select_regional"
      @on-change="select_regional"
      slot="extra"
      v-model="model8"
      style="width:100%"
    >
      <Option
        v-for="item in regional_list"
        :value="item.deviceRegion"
        :key="item.id"
      >{{ item.regionName }}</Option>
    </Select>
    <ul class="device_row">
      <li :key="k" v-for="(item,k) in device_list">
        <div class="device_col">
          <div class="device_img">
            <img :src="item.icon" alt>
          </div>
          <div class="device_name">{{ item.name }}</div>
        </div>
      </li>
    </ul>

    <Modal class="device_dialog" footer-hide v-model="device_dialog" title="设备控制" width="1100">
      <Row type="flex" justify="space-between">
        <Col span="5">
          <div>
            <Select
              @on-change="select_regional"
              slot="extra"
              v-model="full_regional_val"
              style="width:100%"
            >
              <Option
                v-for="item in regional_list"
                :value="item.deviceRegion"
                :key="item.id"
              >{{ item.regionName }}</Option>
            </Select>
          </div>
        </Col>
        <Col span>
          <div>
            <RadioGroup @on-change="trigger_change" v-model="toggle_c" type="button">
              <Radio label="00" :disabled="!trigger_disabled">本地</Radio>
              <Radio label="01" :disabled="trigger_disabled">手动</Radio>
              <Radio label="02" :disabled="trigger_disabled">逻辑</Radio>
            </RadioGroup>
          </div>
        </Col>
        <Col span>
          <div>
            <Button type="error" ghost @click="set_yuzhi">设置阈值</Button>
          </div>
        </Col>
      </Row>

      <ul class="device_ul_c">
        <li class="device_div_c" :key="k" v-for="(item,k) in device_list">
          <div class="device_img">
            <img :src="item.icon" alt>
            <Poptip
              confirm
              title="Are you sure delete this task?"
              ok-text="yes"
              cancel-text="no"
              trigger="hover"
            >
              <div v-show="set_time_lock" v-if="!item.isDoubleSwitch" class="on_time">启用定时</div>
            </Poptip>
          </div>

          <div class="device_name">
            <Spin v-show="item.isDoubleSwitch" size="large" fix v-if="item.loading"></Spin>
            <!-- device_name_loading -->
            <!-- <Spin class="demo-spin-icon-load spin_loading" fix>
              <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            </Spin>-->
            <Tooltip class="set_time" placement="top" content="设置定时">
              <Icon
                v-if="!item.isDoubleSwitch"
                v-show="set_time_lock"
                @click="set_time_btn(item)"
                size="18"
                type="md-time"
                class="ad_time"
              />
            </Tooltip>
            <p class="dev_name">{{ item.name }}</p>
            <!-- v-model="item.curStatu" -->
            <i-switch
              @on-change="single_control(item)"
              v-if="!item.isDoubleSwitch"
              size="large"
              :loading="item.loading"
              v-model="item.lock"
              :disabled="disabled"
            >
              <span slot="open">ON</span>
              <span slot="close">OFF</span>
            </i-switch>

            <RadioGroup
              size="small"
              v-if="item.isDoubleSwitch"
              v-model="item.curStatu"
              type="button"
              @on-change="DoubleSwitch_change(item)"
            >
              <Radio :disabled="disabled" label="64">正转</Radio>
              <Radio :disabled="disabled" label="00">反转</Radio>
              <Radio :disabled="disabled" label="AA">停止</Radio>
            </RadioGroup>
          </div>
        </li>
      </ul>
    </Modal>
    <!-- 阈值设置按钮 抽屉 -->
    <Drawer
      @on-close="set_yuzhi_close"
      title="单设备高级设置"
      v-model="yu_lock"
      width="330"
      :mask-closable="false"
    >
      <Form :model="form_set_threshold" :label-width="80">
        <FormItem label="区域列表">
          <Select
            @on-change="select_regional_yu"
            v-model="form_set_threshold.deviceRegion"
            style="width:100%"
          >
            <Option
              v-for="item in regional_list"
              :value="item.deviceRegion"
              :key="item.id"
            >{{ item.regionName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="阈值名称">
          <Select
            @on-change="select_threshold_yu"
            v-model="form_set_threshold.description"
            style="width:100%"
          >
            <Option
              v-for="item in threshold_list"
              :value="item.description"
              :key="item.id"
            >{{ item.description }}</Option>
          </Select>
        </FormItem>
        <FormItem label="最大值">
          <InputNumber
            :max="1000"
            :min="-1000"
            v-model="form_set_threshold.tMax"
            style="width:100%"
          ></InputNumber>
        </FormItem>
        <FormItem label="最小值">
          <InputNumber
            :max="1000"
            :min="-1000"
            v-model="form_set_threshold.tMin"
            style="width:100%"
          ></InputNumber>
        </FormItem>
        <FormItem label="浮动值">
          <InputNumber
            :max="1000"
            :min="-1000"
            v-model="form_set_threshold.tDiff"
            style="width:100%"
          ></InputNumber>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="yu_lock = false">Cancel</Button>
        <Button @click="sub_form_set_threshold" type="primary">Submit</Button>
      </div>
    </Drawer>
    <!-- 设置定时弹出框 -->
    <Modal v-model="time_dialog" title="设置定时">
      <Form class="time_form" :label-width="80">
        <FormItem label="选择时间段">
          <TimePicker confirm type="timerange" placeholder="开始与结束时间" v-model="add_time"></TimePicker>
        </FormItem>
        <FormItem label>
          <!-- <TimePicker type="time" placeholder="结束时间" v-model="form_time.end_time"></TimePicker> -->
          <Button @click="make_sure_add_time" type="primary">添加新定时</Button>
        </FormItem>
      </Form>

      <Form class="historical_form" :label-width="80">
        <FormItem
          class="historical_time"
          :key="k"
          v-for="(item,k) in decice_time_list"
          label="历史定时"
        >
          <div class="item_box">
            <TimePicker confirm type="timerange" placeholder="开始与结束时间" v-model="item.time_arr"></TimePicker>
            <div class="btn_box">
              <Tooltip placement="top" content="是否启用">
                <i-switch v-model="item.isTiming">
                  <Icon type="md-checkmark" slot="open"></Icon>
                  <Icon type="md-close" slot="close"></Icon>
                </i-switch>
              </Tooltip>
              <Tooltip class="tip_btn" placement="top" content="清除定时">
                <Button
                  @click="delete_time(item.id)"
                  type="error"
                  shape="circle"
                  icon="ios-trash-outline"
                ></Button>
              </Tooltip>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="time_dialog = false">取消</Button>
        <Button :loading="btn_loading" @click="submit_btn_time" type="primary">提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Qs from "qs";
export default {
  data() {
    return {
      model8: "",
      device_dialog: false,
      // 单选按钮 val
      toggle_c: "",
      // 双路value
      DoubleSwitch_val: "",
      // 单路value
      single_control_val: "",
      // 切换等待
      loading: false,
      // 当前区域
      regional: "",
      // 阈值设置 抽屉卡关
      yu_lock: false,
      // 滑块是否可用
      disabled: false,
      // 控制方式的禁用
      trigger_disabled: false,
      // 全屏后的 选择 区域的 val值
      full_regional_val: "",
      // 设置阈值的 form表单数据存放
      form_set_threshold: {},
      // 设置定时弹出框
      time_dialog: false,
      // 设置定时的表单
      form_time: {},
      // 添加定时选择框的val\add_time
      add_time: [],
      // 设置定时当前选中的 设备信息
      device_obj: {},
      // 提交定时按钮等待
      btn_loading: false,
      // 本地控制时隐藏定时锁
      set_time_lock: false,
      // 加载框的展示
      device_lock: true
    };
  },
  computed: {
    ...mapState([
      "regional_list",
      "device_list",
      "gserial",
      "threshold_list",
      "decice_time_list"
    ])
  },
  methods: {
    ...mapActions([
      "get_regional",
      "get_device",
      "get_threshold",
      "get_decice_time"
    ]),
    // 点击提交现有的定时信息
    async submit_btn_time() {
      this.btn_loading = true;
      // console.log(this.device_obj);

      var obj = {
        controllerAddr: this.device_obj.controllerAddr,
        dId: this.device_obj.id,
        datas: this.decice_time_list,
        deviceAddr: this.device_obj.deviceAddr,
        gSerial: this.device_obj.gSerial
      };
      // console.log(this.decice_time_list);

      let { data: res } = await this.$http.put("/timing/addTimings", obj);
      console.log(obj);
      this.btn_loading = false;
      if (res.status != 0) return this.$Message.warning(res.msg);
      this.$Message.success(res.msg);

      console.log(res);
    },
    // 删除定时按钮
    delete_time(time_id) {
      // 传回当前定时id
      this.decice_time_list.some((item, index) => {
        // 循环在数组找出 对应的定时信息
        if (item.id == time_id) {
          // delete item;
          // 再找到的 当前索引的 数据 里当前位置 向前删除一位 改变原数组
          this.decice_time_list.splice(index, 1);
          // 返回true停止循环
          return true;
        }
      });
    },
    // 点击确认添加这条定时
    async make_sure_add_time() {
      var obj = { ...this.device_obj };
      obj.startTime = `1970-01-01 ${this.add_time[0]}`;
      obj.endTime = `1970-01-01 ${this.add_time[1]}`;
      obj.isTiming = false;
      obj.dId = obj.id;
      var arr = [obj.startTime.substr(11), obj.endTime.substr(11)];
      obj.time_arr = arr;
      // console.log(obj);
      // console.log(this.decice_time_list);

      this.decice_time_list.push(obj);
      // var put_obj = {
      //   controllerAddr: obj.controllerAddr,
      //   dId: obj.id,
      //   deviceAddr: obj.deviceAddr,
      //   gSerial: obj.gSerial
      // };
      // var obj2 = { ...obj };
      // obj2.startTime = `1970-01-01 ${this.add_time[0]}`;
      // obj2.endTime = `1970-01-01 ${this.add_time[1]}`;
      // obj2.isTiming = false;
      // var arr = [];
      // arr.push(obj2);
      // put_obj.datas = arr;
      // console.log(put_obj);

      // let { data: res } = await this.$http.put("/timing/addTimings", put_obj);
      // if (res.status != 0) return this.$Message.warning(res.msg);
      this.$Message.success("添加成功");
    },
    // 点击设置定时按钮
    async set_time_btn(device_obj) {
      // console.log(device_obj);
      this.device_obj = device_obj;
      await this.get_decice_time(device_obj.id);
      // 弹出框显示
      this.time_dialog = true;
      console.log(this.decice_time_list);

      if (!this.decice_time_list)
        return this.$Message.warning("该设备尚未添加定时记录");

      this.decice_time_list.forEach(item => {
        var arr = [item.startTime.substr(11), item.endTime.substr(11)];
        item.time_arr = arr;
      });
    },
    // 提交选择区域的表单按钮点击
    async sub_form_set_threshold() {
      let { data: res } = await this.$http.put(
        "/threshold/add",
        this.form_set_threshold
      );
      if (res.status != 0) return this.$Message.warning(res.msg);
      this.$Message.success(res.msg);
      this.yu_lock = false;
    },
    // 选择区域·
    async select_regional_yu(a) {
      // 获取该区域下的阈值
      await this.get_threshold(a);
      // 默认将第一个阈值信息展示
      this.form_set_threshold = { ...this.threshold_list[0] };
    },
    // 选择阈值
    async select_threshold_yu(a) {
      // 因为切换区域触发的 选择框变化在此阻止
      if (!a) return;
      var obj = [];
      // 选择框 变化时默认将这个阈值的信息展示出来
      obj = this.threshold_list.filter(item => {
        return item.description == a;
      });
      this.form_set_threshold = { ...obj[0] };
    },
    // 点击设置阈值按钮
    async set_yuzhi() {
      this.device_dialog = false;
      this.yu_lock = true;
      await this.get_threshold(this.regional);
      this.form_set_threshold = { ...this.threshold_list[0] };
      //
    },
    set_yuzhi_close() {
      this.device_dialog = true;
    },
    // 设备发送数据请求事件封装
    async device_post(obj) {
      obj.orders = obj.curStatu;
      let { data: res } = await this.$http.post(
        "/device/ctrl",
        Qs.stringify(obj)
      );
      console.log(res);

      if (res.status != 0) {
        this.$Message.warning(res.msg);
        //
        await this.get_device(this.regional);
        //
        obj.loading = false;

        return false;
      }
      obj.loading = false;

      this.$Message.success(res.msg);
    },
    // 双路设备控制事件
    DoubleSwitch_change(obj) {
      obj.loading = true;
      // console.log(obj);
      if (obj.curStatu == "64") {
        obj.icon = obj.icon_gif_64;
      } else if (obj.curStatu == "00") {
        obj.icon = obj.icon_gif_00;
      } else {
        obj.icon = obj.icon_AA;
      }

      this.device_post(obj);
    },
    single_control(obj) {
      obj.loading = true;
      if (obj.lock == true) {
        obj.curStatu = "64";
        obj.icon = obj.icon_gif;
      } else {
        obj.curStatu = "00";
        obj.icon = obj.icon_AA;
      }
      // console.log(obj);

      this.device_post(obj);
    },
    // 更换区域 重新获取设备
    async select_regional(a) {
      if (!a) return;
      this.regional = a;
      await this.get_device(a);
      // 区域下没有设备的情况下
      if (this.device_list.length == 0) return false;
      this.toggle_c = this.device_list[0].controlType;
      // this.trigger_change(this.toggle_c);
      //
      this.toggle_fn(this.device_list[0].controlType);
    },
    // 全屏按钮点击
    async modal_full() {
      this.device_dialog = true;
      this.full_regional_val = this.model8;
    },
    // 设备控制单选框变化
    async trigger_change(c_type) {
      // 选择设备控制方式 发送ajax
      var obj = {
        gSerial: this.gserial,
        deviceRegion: this.regional,
        groupType: this.device_list[0].groupType,
        controlType: c_type
      };
      let { data: res } = await this.$http.post(
        "/device/switchCtrlTypeByGroup",
        Qs.stringify(obj)
      );
      // 如果操作未成功弹出提示信息 和 重新获取本区域信息
      if (res.status != 0) {
        this.$Message.warning(res.msg);
        await this.get_device(this.regional);
        this.toggle_c = this.device_list[0].controlType;
        this.toggle_fn(this.toggle_c);
        //

        return;
      }
      this.$Message.success(res.msg);

      this.toggle_fn(c_type);
    },
    // 设备控制的方法 封装
    toggle_fn(c_type) {
      // 逻辑控制
      if (c_type == "02") {
        // 禁用所有 设备的滑块 和双路3选
        this.disabled = true;
        // 开放 控制按钮的 逻辑和手动选项
        this.trigger_disabled = false;
        this.set_time_lock = true;

        // 手动控制
      } else if (c_type == "01") {
        // 允许控制该区域下的是所有设备的 开关
        this.disabled = false;
        // 开放 控制按钮的 逻辑和手动选项
        this.trigger_disabled = false;
        this.set_time_lock = true;

        // 本地控制
      } else {
        // 禁止处 本地按钮外的 逻辑和手动按钮
        this.trigger_disabled = true;
        // 禁止所有设备操控按钮
        this.disabled = true;
        // 隐藏定时
        this.set_time_lock = false;
      }
    },
    async one_data() {
      // 获取区域信息
      await this.get_regional();
      if (this.regional_list.length == 0) {
        this.model8 = "";
        await this.get_device(this.model8);
        this.device_lock = true;
        return this.$Message.warning("该网关暂无设备查看");
      }
      this.model8 = this.regional_list[0].deviceRegion;
      //
      this.device_lock = false;

      // return
      // 获取设备 未全屏时
      await this.get_device(this.model8);

      // 默认获取第一个 区域的信息
      this.regional = this.regional_list[0].deviceRegion;
      // 区域下没有设备的情况下
      if (this.device_list.length == 0) return false;
      // 默认获取第一个设备的 控制方式
      this.toggle_c = this.device_list[0].controlType;
      // this.trigger_change(this.toggle_c);
      // 判断 控制方式的方法 ，决定禁用那些按钮
      this.toggle_fn(this.toggle_c);
    }
  }
};
</script>

<style lang='less' scoped>
.select_regional {
  position: absolute;
  z-index: 9;
}
// .historical_form {
//   position: relative;
// }
// .submit_btn {
//   // position: absolute;
//   margin-left: 80%;
// }
.historical_time {
  .item_box {
    display: flex;
    // justify-content: start;
    .btn_box {
      margin-left: 20%;
      .tip_btn {
        margin-left: 16px;
      }
    }
    align-items: center;
  }
}

.time_form {
  display: flex;
}

.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}

.dev_name {
  padding: 20px 0px;
}
.on_time {
  cursor: pointer;
  margin-top: 5px;
}
.set_time {
  position: absolute;
  right: 0px;
  top: -8px;
  cursor: pointer;
  // font-size: 20px;
}

.device_ul_c {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  li {
    width: 33%;
  }
  .device_div_c {
    display: flex;
    // align-items: center;
    padding: 15px;
    .device_img {
      text-align: center;
      width: 30%;
      img {
        width: 100%;
      }
    }
    .device_name_loading {
      position: relative;
      text-align: center;
      width: 50%;
      .ivu-spin-text {
        width: 100%;
      }
    }
    .device_name {
      position: relative;
      width: 100%;
      text-align: center;
      color: #8d9191;
      // line-height: ;
    }
  }
}

.device_row {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  li {
    width: 50%;
  }
  .device_col {
    // height: 100%;
    // box-sizing: border-box;

    // width: 50%;
    display: flex;
    // align-items: center;
    padding: 15px;
    .device_img {
      width: 30%;
      img {
        width: 100%;
      }
    }
    .device_name {
      width: 50%;
      text-align: center;
      color: #8d9191;
      // line-height: ;
    }
  }
}
</style>
