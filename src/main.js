import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import iView from 'iview';
import axios from 'axios'
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import './registerServiceWorker'
import "./assets/css/resset.css"
import md5 from 'js-md5'
Vue.prototype.$md5 = md5
axios.interceptors.request.use(function (config) {
  var token = window.sessionStorage.getItem("token");
  config.headers.common.token = token
  // console.log(config.headers);

  if (window.location.hash != '/' || window.location.hash != '/login') {
    // console.log(window.location.hash);

    if (!window.sessionStorage.getItem("token")) {
      window.location.hash = '/'
    }
  }
  // axios请求前的逻辑处理
  return config;
}, function (error) {
  return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
  if (response.data.status == 5 || response.data.status == 11) {
    alert(response.data.msg)
    window.location.href = '/'

  }
  // axios完整请求的后续逻辑处理
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

axios.defaults.baseURL = 'https://www.raintec.cn'
Vue.prototype.$http = axios
store.$http = axios
// console.log(store);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
