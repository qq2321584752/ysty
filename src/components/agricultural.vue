<template>
  <Card class="i_card agricultural_card" style="width:100%;">
    <p slot="title">
      <Icon size="20" type="ios-list-box"/>农事管理
      <Icon class="contract" size="20" type="ios-expand" @click="modal_full"/>
    </p>
    <!-- <Spin v-if="loading" fix>暂无数据查看...</Spin> -->

    <Button class="add_record" @click="add_record" icon="md-add" slot="extra">添加记录</Button>
    <Spin v-if="one_loading" fix>
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <ul>
      <li class="row_record record_col" :key="k" v-for="(item,k) in farming_list||'123'">
        <span class="span_record">
          <Icon @click="detail_record(item)" type="ios-pricetag-outline"/>
          {{item.record}}
        </span>
        <span>{{item.createTime}}</span>
      </li>
    </ul>
    <!-- 添加农事记录 弹出层 -->
    <Modal v-model="add_record_dialog" title="添加农事记录" width="50%">
      <Form class="form_record" ref="formInline" :model="farmManangement" :label-width="60">
        <FormItem label="类型">
          <Select v-model="farmManangement.type" style="width:100%">
            <Option v-for="item in type_List" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="日期">
          <DatePicker
            type="datetime"
            v-model="farmManangement.actionTime"
            placeholder="Select date and time"
            style="width: 100%"
            class="a_input"
          ></DatePicker>
        </FormItem>
        <FormItem label="操作人员">
          <Input style="width:100%" class="a_input" v-model="farmManangement.operator"></Input>
        </FormItem>
        <FormItem class="textarea_" label="记录">
          <Input
            v-model="farmManangement.record "
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="记录内容..."
            class="text_area"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-right: 8px" @click="add_record_dialog = false">取消</Button>
        <Button @click="submit_btn" type="primary">提交</Button>
      </div>
    </Modal>
    <!-- 全屏按钮点击 弹出层 -->

    <Modal width="60%" v-model="full_all_show" title="农事信息">
      <Table class="farming_table" :disabled-hover="true" :columns="columns1" :data="farming_list">
        <template slot-scope="{ row }" slot="type">
          <!-- <Input type="text" v-model="editAge" v-if="editIndex === index" /> -->
          <!-- <span>{{ row.type }}</span> -->
          <Tag v-if="row.type == 0" color="blue">灌溉</Tag>
          <Tag v-else-if="row.type == 1" color="orange">采收</Tag>
          <Tag v-else color="green">播种</Tag>
        </template>
      </Table>
    </Modal>
    <!-- 查询单个 农事信息 弹出层 -->
    <Modal footer-hide v-model="on_the_one_record" title="Common Modal dialog box title">
      <p>记录人：{{record_obj.operator}}</p>
      <Divider/>
      <p>
        类型：
        <Tag v-if="record_obj.type == 0" color="blue">灌溉</Tag>
        <Tag v-else-if="record_obj.type == 1" color="orange">采收</Tag>
        <Tag v-else color="green">播种</Tag>
      </p>
      <Divider/>
      <p>操作执行时间：{{record_obj.createTime}}</p>
      <Divider/>
      <p>记录时间：{{record_obj.actionTime}}</p>
      <Divider/>
      <!-- <p>类型：{{record_obj.type}}</p> -->

      <div class="area_box">
        <span class="area">记录内容：</span>
        <p>{{record_obj.record}}</p>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      add_record_dialog: false,
      farmManangement: {},
      type_List: [
        { label: "灌溉", value: "0" },
        { label: "采收", value: "1" },
        { label: "播种", value: "2" }
      ],
      loading: false,
      one_loading: true,
      // 全屏弹出框lock
      full_all_show: false,
      // 单个信息弹出层
      on_the_one_record: false,
      // 当前查看的农事纪录
      record_obj: {},
      columns1: [
        {
          title: "记录人",
          key: "operator"
        },

        {
          title: "记录日期",
          key: "actionTime"
        },
        {
          title: "操作时间",
          key: "createTime"
        },
        {
          title: "类型",
          slot: "type"
        },
        {
          title: "记录内容",
          key: "record"
        }
      ]
    };
  },
  created() {
    // this.one_data();
  },
  computed: {
    ...mapState(["farming_list", "sId"])
  },
  methods: {
    ...mapActions(["get_farming_list"]),
    // 点击查看单个 农事纪录
    detail_record(obj) {
      this.record_obj = obj;
      this.on_the_one_record = true;
    },
    // 提交农事记录
    async submit_btn() {
      // createTime
      var obj = { ...this.farmManangement };
      //

      obj.actionTime = new Date(this.farmManangement.actionTime).getTime();
      obj.sId = this.sId;
      obj.createTime = new Date().getTime();
      let { data: res } = await this.$http.put("/farm/add", obj);
      if (res.status != 0) return this.$Message.error(res.status);
      this.$Message.success("添加记录成功");
      this.add_record_dialog = false;
      this.one_data();
    },
    // 点击添加农事纪录
    add_record() {
      this.add_record_dialog = true;
    },
    // 全屏按钮点击事件
    modal_full() {
      this.full_all_show = true;
    },
    // 首次数据加载
    async one_data() {
      // 获取农事纪录
      await this.get_farming_list();

      if (!this.farming_list) {
        // this.loading = true;
        this.one_loading = true;

        return this.$Message.warning("该站点暂无农事信息查看");
      }
      this.one_loading = false;

      // this.loading = false;
    }
  }
};
</script>

<style lang='less' scoped>
.area_box {
  display: flex;
}
.area {
  height: 100%;
  min-width: 60px;
}

.span_record {
  width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
}
// !important
.row_record {
  display: flex;
  flex-wrap: nowrap;
  line-height: 70px;
  border-bottom: 1px dashed #e8eaec;
  i {
    cursor: pointer;
  }
}
.record_col {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.form_record {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .ivu-form-item {
    width: 30%;
  }
  .textarea_ {
    width: 100%;
  }
}
.add_record {
  width: 100% !important;
  position: absolute;
  z-index: 9;
}
</style>
