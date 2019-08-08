<template>
  <Card style="width:100%;height:100%" class="i_card">
    <p slot="title">
      <Icon size="20" type="ios-podium"/>实时数据
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
  </Card>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  created() {
    // console.log(this.cjq_list);
  },
  data() {
    return {
      randomMovieList: [],
      model8: "",
      // 当前网关
      gSerial: ""
      // cjq_mr: ""
    };
  },
  computed: {
    ...mapState(["cjq_list", "cjq_data"])
  },
  methods: {
    select_cjq(a) {
      // console.log(a);
      this.collector_data({
        gSerial: this.gSerial,
        collectorAddr: this.model8
      });

      // this.cjq_mr = this.cjq_mr;
    },

    // 发怂ajax 获取当前采集器下的实时数据
    ...mapActions(["collector_data"]),

    async one_data(gSerial) {
      this.model8 = this.cjq_list[0].addr;
      this.gSerial = gSerial;
      this.collector_data({ gSerial: gSerial, collectorAddr: this.model8 });
      console.log(this.cjq_data);

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
.ivu-card-extra {
  width: 20% !important;
}
.data_ui {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  li {
    width: 45%;
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
      flex: 1;
      width: 50%;
      height: 100%;
      // margin-bottom: -5px;
    }
    div {
      // flex: 1;
      width: 50%;
    }
  }
}
.i_card {
  .ivu-card-body {
    overflow: auto;
    height: 73% !important;
  }
}
</style>

