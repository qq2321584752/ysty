<template>
  <!-- <div> -->
  <Card class="map_card i_card" style="width:100%;">
    <div style="text-align:center">
      <!-- <img src="../../images/logo.png"> -->
      <!-- <h3>A high quality UI Toolkit based on Vue.js</h3> -->
      <div id="container"></div>
    </div>
  </Card>
  <!-- </div> -->
</template>

 <script
      type="text/javascript"
      src="https://cache.amap.com/lbs/static/addToolbar.js"
    ></script>
<script>
import { mapState, mapActions } from "vuex";

export default {
  created() {
    // setTimeout(() => {
    //   this.init_map();
    // }, 2000);
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["sId"])
  },
  methods: {
    async init_map(gateway_list) {
      let { data: res } = await this.$http(
        `/stationArea/listBySid/${this.sId}`
      );
      var googleLayer = new AMap.TileLayer({
        getTileUrl:
          "http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile"
      }); //定义谷歌卫星切片图层

      var roadNetLayer = new AMap.TileLayer.RoadNet(); //定义一个路网图层

      var imageLayer = new AMap.ImageLayer({
        // url: 'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
        // url: "file://C:/Users/Administrator/Desktop/l1.png",
        bounds: new AMap.Bounds(
          [125.01057, 44.527368], //左下角
          [125.015291, 44.53055] //右上角
        )
      });
      //设置透明度
      imageLayer.setOpacity(0.5);

      var map = new AMap.Map("container", {
        //center: [114.479347,36.536979], //邯郸
        //center:[116.408967,39.880101],
        // center: [125.013102, 44.537785], //吉林省农安县万顺乡农家堰
        center: [114.571865, 37.788396],
        //center:[105.606322,30.154596],//红蜻蜓
        zoom: 12, //设置缩放级别
        layers: [googleLayer, roadNetLayer, imageLayer], //设置图层
        zooms: [1, 23],
        showLabel: true,
        pitch: 55,
        forceVector: false,
        resizeEnable: true,
        expandZoomRange: true
      });

      map.plugin(["AMap.Scale"], function() {
        var scale = new AMap.Scale();
        map.addControl(scale);
      });
      // map.on("click", function(e) {
      //
      // });
      var marker_list = [];
      gateway_list.forEach(item => {
        var icon = new AMap.Icon({
          size: new AMap.Size(19, 33),
          // 图标尺寸
          image: item.isOnline
            ? require("../assets/img/marker/mark_bs.png")
            : require("../assets/img/marker/mark_bs1.png")
          // Icon的图像
          // imageOffset: new AMap.Pixel(-8, -33)
          // 图像相对展示区域的偏移量，适于雪碧图等
          //  imageSize: new AMap.Size(40, 50) // 根据所设置的大小拉伸或压缩图片 });
          // 将 Icon 实例添加到 marker 上:
        });
        var marker = new AMap.Marker({
          position: new AMap.LngLat(item.lng, item.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9] title: '北京' });
          title: item.name,
          icon: icon,
          offset: new AMap.Pixel(-8, -33)
          // 将创建的点标记添加到已有的地图实例：
          // 移除已创建的 marker
        });
        marker_list.push(marker);
        marker.serial = item.serial;
        marker.on("click", e => {
          this.$emit("map_serial", e.target.serial);
        });
      });

      map.add(marker_list);
      map.setFitView();

      // map.remove(marker);
      // 添加区域
      if (!res.datas) return this.$Message.warning("地图暂无区域查看");

      res.datas.forEach((item, index) => {
        var path = item.areaBound.split(";");
        var arr = [];
        path.forEach(item => {
          arr.push(item.split(","));
        });

        var polygon = new AMap.Polygon({
          path: arr,
          isOutline: true,
          borderWeight: 3,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          // 线样式还支持 'dashed'
          fillColor: "yellow",
          zIndex: 50,
          map: map
        });
      });
      // //区域1
      // var path = [
      //   [125.011198, 44.540313],
      //   [125.013354, 44.541468],
      //   [125.017013, 44.538118],
      //   [125.014963, 44.536818]
      // ];
      // var polygon = new AMap.Polygon({
      //   path: path,
      //   isOutline: true,
      //   borderWeight: 3,
      //   strokeColor: "#FF33FF",
      //   strokeWeight: 6,
      //   strokeOpacity: 0.2,
      //   fillOpacity: 0.4,
      //   // 线样式还支持 'dashed'
      //   fillColor: "yellow",
      //   zIndex: 50,
      //   map: map
      // });

      // polygon.on("click", openInfo);
      // polygon1.on("click", openInfo);

      // polygon2.on("click", openInfo);
      // polygon3.on("click", openInfo);
      // polygon4.on("click", openInfo);
      //绘图区域点击后要执行的方法：弹出信息
      var info;
      function openInfo(e) {
        //alert(info==null);
        if (info == null) {
          info = [];
          info.push(
            '<div class=\' content-window-card\'><div><img style="float:left;width:30px;height:30px"		src="http://114.115.135.159:8080/lib/images/img/logo.png "/></div> '
          );
          info.push('<div style="padding:7px 0px 0px 0px;"><h4>农家堰1区</h4>');
          info.push(
            "<p class='input-item'>电话 : 00000000   邮编 : 056400</p>"
          );
          info.push(
            "<p class='input-item'>地址 :吉林省农家堰1区</p></div></div>"
          );
        }

        infoWindow = new AMap.InfoWindow({
          content: info.join("") //使用默认信息窗体框样式，显示信息内容
        });

        // infoWindow.open(map, [e.lnglat.getLng(), e.lnglat.getLat()]);
        // document.getElementById("lnglat").value =
        //   e.lnglat.getLng() + "," + e.lnglat.getLat();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.map_card {
  padding: 10px;
  .ivu-card-body {
    position: relative;
    height: 100%;
    #container {
      border-radius: 4px;
    }
  }
}
</style>
