<template>
  <!-- <div> -->
  <Card style="width:100%;height:50%">
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
export default {
  data() {
    return {};
  },
  methods: {
    init_map() {
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
        ),

        zooms: [10, 18]
      });
      //设置透明度
      imageLayer.setOpacity(0.5);

      var map = new AMap.Map("container", {
        //center: [114.479347,36.536979], //邯郸
        //center:[116.408967,39.880101],
        center: [125.013102, 44.537785], //吉林省农安县万顺乡农家堰
        //center:[105.606322,30.154596],//红蜻蜓
        zoom: 15, //设置缩放级别
        layers: [googleLayer, roadNetLayer, imageLayer], //设置图层
        zooms: [1, 23],
        showLabel: true,
        pitch: 55,
        forceVector: false,
        resizeEnable: true,
        expandZoomRange: true
      });
      map.on("click", function(e) {
        document.getElementById("lnglat").value =
          e.lnglat.getLng() + "," + e.lnglat.getLat();
        //alert("经度(lng)  "+e.lnglat.getLng() + "\n纬度(lat)   " + e.lnglat.getLat());
      });
      map.plugin(["AMap.Scale"], function() {
        var scale = new AMap.Scale();
        map.addControl(scale);
      });
      map.on("click", function(e) {
        console.log(e.lnglat + "");
      });

      //区域1
      var path = [
        [125.011198, 44.540313],
        [125.013354, 44.541468],
        [125.017013, 44.538118],
        [125.014963, 44.536818]
      ];
      var polygon = new AMap.Polygon({
        path: path,
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

      //区域2
      var path1 = [
        [125.012157, 44.534735],
        [125.013326, 44.535194],
        [125.014678, 44.533642],
        [125.01353, 44.533137]
      ];
      var polygon1 = new AMap.Polygon({
        path: path1,
        isOutline: true,
        borderWeight: 3,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        fillColor: "orange",
        zIndex: 50,
        map: map
      });

      //区域3
      var path2 = [
        [125.011171, 44.532019],
        [125.008295, 44.530825],
        [125.00748, 44.529632],
        [125.008896, 44.528103],
        [125.010913, 44.528378],
        [125.010313, 44.529785],
        [125.012501, 44.530764]
      ];
      var polygon2 = new AMap.Polygon({
        path: path2,
        isOutline: true,
        borderWeight: 3,
        strokeColor: "blue",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        fillColor: "white",
        zIndex: 50,
        map: map
      });

      var path3 = [
        [105.606575, 30.149873],
        [105.606685, 30.149794],
        [105.608175, 30.149474],
        [105.607894, 30.148492],
        [105.60719, 30.148492],
        [105.607022, 30.148528],
        [105.60673, 30.148447],
        [105.606448, 30.148447],
        [105.606151, 30.148359]
      ];
      var polygon3 = new AMap.Polygon({
        path: path3,
        isOutline: true,
        borderWeight: 3,
        strokeColor: "blue",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        fillColor: "white",
        zIndex: 50,
        map: map
      });

      var path4 = [
        [105.608969, 30.150341],
        [105.609251, 30.150035],
        [105.609374, 30.149872],
        [105.609723, 30.149527],
        [105.609942, 30.149335],
        [105.609866, 30.149209],
        [105.60989, 30.149096],
        [105.609644, 30.148832],
        [105.609341, 30.148629],
        [105.608728, 30.148425],
        [105.608491, 30.148432],
        [105.607949, 30.148488],
        [105.608296, 30.149707]
      ];
      var polygon4 = new AMap.Polygon({
        path: path4,
        isOutline: true,
        borderWeight: 3,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        fillColor: "orange",
        zIndex: 50,
        map: map
      });

      polygon.on("click", openInfo);
      polygon1.on("click", openInfo);

      polygon2.on("click", openInfo);
      polygon3.on("click", openInfo);
      polygon4.on("click", openInfo);
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

        infoWindow.open(map, [e.lnglat.getLng(), e.lnglat.getLat()]);
        document.getElementById("lnglat").value =
          e.lnglat.getLng() + "," + e.lnglat.getLat();
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
