<template>
  <Card class="camera_card i_card" style="width:100%;">
    <Spin v-if="loading" fix>暂无数据查看...</Spin>

    <!-- class="video-js vjs-default-skin" -->
    <video muted="muted" loop id="my-video" autoplay controls preload="auto">
      <source type="application/x-mpegURL">
    </video>
    <Icon v-show="!index <= 0" class="left_r" @click="left_r" type="md-arrow-round-back"/>
    <Icon class="right_r" @click="right_r" type="md-arrow-round-forward"/>
  </Card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  mounted() {},
  data() {
    return {
      loading: false,
      obj_src: {},
      index: 0
    };
  },

  computed: {
    ...mapState(["video_list"])
  },
  methods: {
    ...mapActions(["gateway_video"]),
    // 左箭头点击
    left_r() {
      this.index--;
      this.one_data();
    },
    right_r() {
      this.index++;
      this.one_data();
    },
    async fn(url) {
      if (Hls.isSupported(url)) {
        var video = document.getElementById("my-video"); // 获取 video 标签
        var hls = new Hls(); // 实例化 Hls 对象
        hls.loadSource(url); // 传入路径
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          // setTimeout(() => {
          //
          //   var promise = video.play(); // 调用播放 API
          //   if (promise !== undefined) {
          //     promise
          //       .then(_ => {
          //         // Autoplay started!
          //       })
          //       .catch(error => {
          //         // Autoplay was prevented.
          //         // Show a "Play" button so that user can start playback.
          //       });
          //   }
          // }, 2000);
        });
      }
    },
    // baiduMp4(mp4Url, imgUrl) {
    //   var player = cyberplayer("my-video").setup({
    //     width: "100%", // 宽度，也可以支持百分比(不过父元素宽度要有)
    //     height: "100%", // 高度，也可以支持百分比
    //     title: mp4Url.name, // 标题
    //     file: mp4Url.playUrl, // 播放地址
    //     image: "../assets/img/云上田野logo1.png", // 预览图
    //     autostart: false, // 是否自动播放
    //     stretching: "uniform", // 拉伸设置
    //     repeat: true, // 是否重复播放
    //     volume: 100, // 音量
    //     controls: true, // controlbar是否显示
    //     starttime: 0, // 视频开始播放时间点(单位s)，如果不设置，则可以从上次播放时间点续播
    //     skin: {
    //       name: "bce", // 默认皮肤-bce，其他可选项有beelden, bekle, five, glow, roundster, seven, six, stormtrooper, vapor
    //       background: "transparent", // 背景色设置
    //       inactive: "#FFF", // 未激活时的颜色
    //       active: "#13cde2" // 悬浮或激活的严责
    //     },
    //     logo: {
    //       // logo设置
    //       linktarget: "_blank",
    //       margin: 8,
    //       hide: false,
    //       position: "top-right", // 位置
    //       file: "../assets/img/云上田野logo1.png" // 图片地址
    //     },
    //     ak: "b5103dcc9fc84957856a1085e4ddf0b7" // 公有云平台注册即可获得accessKey
    //   });
    // },
    // 首次数据
    async one_data() {
      await this.gateway_video();

      if (!this.video_list) {
        // this.fn("132");
        this.loading = true;
        return this.$Notice.warning({ title: "当前网关暂无更多视频信息。" });
      }
      this.loading = false;

      if (!this.qh_video()) return;
      this.obj_src = this.video_list[this.index];
      this.fn(this.obj_src.playUrl);

      //
    },
    qh_video() {
      if (this.index >= this.video_list.length || this.video_list.length == 0) {
        this.index = 0;
        this.obj_src = this.video_list[this.index];
        this.fn(this.obj_src.playUrl);
        this.$Notice.warning({ title: "当前网关暂无更多视频信息。" });
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.camera_card {
  position: relative;
}
#my-video {
  width: 100%;
  height: 100%;
  border-radius: 5px !important;
  //   color: transparent;
}
.left_r {
  z-index: 9;
  font-size: 26px;
  color: #23d4f3;
  position: absolute;
  left: 10px;
  top: 50%;
  cursor: pointer;
}
.right_r {
  z-index: 9;
  cursor: pointer;
  right: 10px;
  font-size: 26px;
  color: #23d4f3;
  position: absolute;
  top: 50%;
}
</style>
