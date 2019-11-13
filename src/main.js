import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import iView from "iview";
import axios from "axios";
import VueJsonp from "vue-jsonp";
import "iview/dist/styles/iview.css";

Vue.use(iView);
// console.log(123);

Vue.use(VueJsonp);

import "./registerServiceWorker";
import "./assets/css/resset.css";
import md5 from "js-md5";

Vue.prototype.$md5 = md5;

var vue_ = new Vue();
vue_.$Loading.config({
  color: "#00FFFF",
  failedColor: "#f0ad4e",
  height: 1
});
axios.interceptors.request.use(
  function(config) {
    var token = window.sessionStorage.getItem("token");
    config.headers.common.token = token;
    // console.log(config);

    if (window.location.hash != "/" || window.location.hash != "/login") {
      // console.log(window.location.hash);

      if (!window.sessionStorage.getItem("token")) {
        window.location.hash = "/";
      }
    }
    vue_.$Loading.start();
    // that.$Loading.start();
    // axios请求前的逻辑处理
    return config;
  },
  function(error) {
    vue_.$Loading.error();

    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    // 身份过期 或者 达到登录限制
    if (response.data.status == 5 || response.data.status == 11) {
      // 弹出 系统弹窗 防止用户瞎点
      alert(response.data.msg);
      // 调回登录页;
      window.location.href = "/";
    }
    vue_.$Loading.finish();

    // axios完整请求的后续逻辑处理
    return response;
  },
  function(error) {
    vue_.$Loading.error();

    // Do something with response error
    return Promise.reject(error);
  }
);

axios.defaults.baseURL = "https://www.raintec.cn";
// axios.defaults.baseURL = "http://192.168.1.201:8080/";
// axios.defaults.baseURL = "http://192.168.1.109:8080/";

// axios.defaults.baseURL = "/ips/";

Vue.prototype.$http = axios;
store.$http = axios;
// console.log(store);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
