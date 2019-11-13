<template>
  <Card style="width:100%;" class="i_card warning_card">
    <p slot="title">
      <Icon size="24" type="ios-calendar"/>报警日志
      <Icon class="contract" size="20" type="ios-expand" @click="modal_full"/>
    </p>
    <Spin v-if="loading" fix>暂无数据查看...</Spin>
    <ul class="warning_ul">
      <li :key="k" v-for="(item,k) in warning_data.datas">
        <p class="clearfix">
          {{ item.gateWayName + ' ' + item.updateTime }}
          <Badge :dot="!item.isChecked" class="fr">
            <Button @click="alert_msg(item)" type="info" ghost>{{item.isChecked?'已查看':'未查看'}}</Button>
          </Badge>
        </p>
        <Divider dashed/>
      </li>
    </ul>
    <!-- 点击提示信息 报警 -->
    <Modal
      footer-hide
      title="信息提示"
      v-model="war_msg_box"
      class-name="vertical-center-modal warning_tip"
    >
      <p>编号: {{warning_obj.id}}</p>
      <Divider/>
      <p>所属网关: {{warning_obj.gateWayName}}</p>
      <Divider/>
      <p>开始时间: {{warning_obj.updateTime}}</p>
      <Divider/>
      <p>
        警告信息:
        <span style="color:#fd5858">{{warning_obj.message}}</span>
      </p>
      <Divider/>
    </Modal>
    <!-- 点击进入报警 全屏按钮 -->
    <Modal
      class="warning_dialog"
      v-model="war_full_box"
      footer-hide
      title="Fullscreen Modal"
      width="1000"
      :styles="{top: '20px'}"
    >
      <!-- 顶部 操作选项 -->
      <Row class="top_row" type="flex" justify="space-between">
        <Col span>
          <Select
            @on-clear="clear"
            @on-change="select_gateway_warning"
            clearable
            v-model="gateway_serial"
            size="small"
            style="width:100px"
          >
            <Option
              v-for="item in user_gateway_list"
              :value="item.serial"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span>
          <Button @click="set_btn('')" size="small" type="error" ghost>报警设置</Button>
        </Col>
      </Row>
      <!-- 数据展示表格 -->
      <Table
        :disabled-hover="true"
        :loading="loading_table"
        border
        :columns="columns12"
        :data="warning_full_msg.datas"
      >
        <!-- <template slot-scope="{ row }" slot="name"> -->
        <!-- <strong>{{ row.name }}</strong> -->
        <!-- </template> -->
        <template slot-scope="{ row }" slot="action">
          <Badge :dot="!row.isChecked">
            <Button
              size="small"
              @click="alert_msg(row)"
              type="info"
              ghost
            >{{row.isChecked?'已查看':'未查看'}}</Button>
          </Badge>
          <!-- <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button> -->
          <!-- <Button type="error" size="small" @click="remove(index)">Delete</Button> -->
        </template>
      </Table>
      <!-- 分页 -->
      <Page
        @on-page-size-change="page_size_change"
        @on-change="size_change"
        :total="warning_full_msg.total"
        show-sizer
        show-total
        :page-size-opts="[5,10,15,20]"
        size="small"
      />
    </Modal>

    <!-- 报警设置 抽屉 -->
    <Drawer
      title="报警设置"
      v-model="set_warning_rule"
      :mask-closable="false"
      :styles="styles"
      @on-close="close_drawer"
      width="30%"
    >
      <Form :model="set_warning_form" label-position="left" :label-width="100">
        <FormItem label="区域列表">
          <Select
            @on-change="select_device"
            v-model="set_warning_form.deviceRegion"
            style="width:100%"
          >
            <Option
              v-for="item in region_List"
              :value="item.deviceRegion"
              :key="item.id"
            >{{ item.regionName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="参数名称">
          <Select @on-change="select_type" v-model="set_warning_form.groupType" style="width:100%">
            <Option
              v-for="(item,k) in ele_list"
              :value="item.groupType"
              :key="k"
            >{{ item.description }}</Option>
          </Select>
        </FormItem>
        <FormItem label="最大值">
          <InputNumber v-model="set_warning_form.tMax"></InputNumber>
          <!-- <Input v-model="set_warning_form.tMax"></Input> -->
        </FormItem>
        <FormItem label="最小值">
          <InputNumber v-model="set_warning_form.tMin"></InputNumber>

          <!-- <Input v-model="set_warning_form.tMin"></Input> -->
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="sub_warning_f">保存</Button>
      </div>
    </Drawer>
  </Card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  created() {
    // this.one_data();
  },
  data() {
    return {
      loading: false,
      war_msg_box: false,
      //   当前查看的报警信息
      warning_obj: {},
      // 全屏按钮 on|off
      war_full_box: false,
      //选择网关 value值 当前选择查看的报警网关
      gateway_serial: "",
      columns12: [
        {
          title: "编号",
          key: "id"
        },
        // {
        //   title: "网关名称",
        //   key: "gateWayName"
        // },
        {
          title: "报警项目",
          key: "message"
        },
        {
          title: "开始时间",
          key: "updateTime"
        },
        {
          title: "状态",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data6: [],
      // 当前页数
      page: "",
      // 一页多少掉数据
      page_size: "10",
      // 编辑报警设置
      set_warning_rule: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
        zIndex: 999
      },
      // 设置报警信息表单
      set_warning_form: {},
      loading_table: true
    };
  },
  computed: {
    ...mapState([
      "warning_data",
      "user_gateway_list",
      "warning_full_msg",
      "region_List",
      "ele_list",
      "gserial"
    ])
  },
  methods: {
    ...mapActions([
      "warning",
      "warning_all",
      "user_gateway",
      "region_list",
      "ele_actions"
    ]),

    // 提交报警设置表单
    async sub_warning_f() {
      this.set_warning_form.gSerial = this.gateway_serial;
      let { data: res } = await this.$http.put(
        `/alermOrder/add`,
        this.set_warning_form
      );
      if (res.status != 0) return this.$Message.error(res.msg);
      this.$Message.success(res.msg);
      // 刷新表格数据
      this.fn();
      // 关闭当前抽屉
      this.set_warning_rule = false;
      // 弹出数据表格
      this.war_full_box = true;

      //
      //
    },
    // 选择区域变化
    async select_device(a) {
      this.set_warning_form.deviceRegion = a;
      this.set_btn(a);
    },
    // 选择元素框变化
    select_type(a) {
      //
      var obj = this.ele_list.filter(item => {
        return item.groupType == a;
      });
      //

      // 默认赋值最大值
      this.set_warning_form.tMax = obj[0].tMax;
      this.set_warning_form.tMin = obj[0].tMin;

      // 响应数据变化
      this.set_warning_form = { ...this.set_warning_form };
      //
    },

    // 点击报警设置按钮
    async set_btn(lock) {
      this.set_warning_rule = true;
      this.war_full_box = false;
      // 获取区域信息方法
      await this.region_list(this.gateway_serial);
      // 给选择区域一个默认值
      // if (lock) {
      // 初次调用 没有传值 不采用 lock 进行默认值赋值 在切换事件的时候 传入区域信息
      this.set_warning_form.deviceRegion =
        lock || this.region_List[0].deviceRegion;
      // }
      //

      // 根据区域号获取元素列表
      var obj = {
        gSerial: this.gateway_serial,
        deviceRegion: this.set_warning_form.deviceRegion
      };
      await this.ele_actions(obj);
      this.set_warning_form.groupType = this.ele_list[0].groupType;
      // 默认赋值最大值
      this.set_warning_form.tMax = this.ele_list[0].tMax;
      this.set_warning_form.tMin = this.ele_list[0].tMin;

      // 响应数据变化
      this.set_warning_form = { ...this.set_warning_form };
      //
      //
    },
    close_drawer() {
      this.war_full_box = true;
    },
    clear() {
      setTimeout(() => {}, 2000);
    },
    // 选择 网关的报警信息
    async select_gateway_warning(gSerial) {
      this.gateway_serial = gSerial;
      // await this.fn();
      var obj = {
        gSerial: this.gateway_serial || this.gserial,
        page: this.page,
        pageSize: this.page_size
      };

      await this.warning_all(obj);

      if (!this.warning_full_msg.datas) {
        // this.warning_full_msg = {
        //   datas: []
        // };

        return this.$Message.warning("暂无报警信息");
      }
      // this.warning();

      //
    },
    // 分页改变
    async size_change(a) {
      this.page = a;
      this.fn();
    },
    // 一页多少条数据
    async page_size_change(a) {
      this.page_size = a;
      this.fn();
    },
    // 发送获取报警信息封装
    async fn() {
      var obj = {
        gSerial: this.gateway_serial || this.gserial,
        page: this.page,
        pageSize: this.page_size
      };

      await this.warning_all(obj);
      if (!this.warning_full_msg.datas) {
        // this.warning_full_msg = {
        //   datas: []
        // };
        return this.$Message.warning("暂无报警信息");
      }
    },
    // 点击查看按钮·

    async alert_msg(obj) {
      //
      let { data: res } = await this.$http(
        `/alermMsg/setMessageChecked/${obj.id}`
      );

      //
      this.warning_obj = obj;
      //
      this.war_msg_box = true;

      this.warning();
      this.fn();
    },
    // 全屏按钮点击
    async modal_full() {
      this.war_full_box = true;
      await this.user_gateway();

      this.gateway_serial = this.user_gateway_list[0].serial;
      var obj = {
        gSerial: this.gateway_serial,
        size: 1,
        pageSize: 10
      };

      this.warning_all(obj);
      this.loading_table = false;

      // this.warning_all({})
    },
    async one_data() {
      await this.warning();
      if (!this.warning_data.datas) {
        this.loading = true;

        return this.$Message.warning("该网关暂无报警信息查看");
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
.warning_ul {
  p {
    color: #cfcbcb;
    // padding: 15px 0px;
  }
}
</style>
