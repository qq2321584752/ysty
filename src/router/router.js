import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./../views/Home.vue";
import login from "./../views/login.vue";

Vue.use(VueRouter);

export default new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: login
    },
    {
      path: "/main",
      // name: "home",
      component: Home
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: function () {
      //   return import(/* webpackChunkName: "about" */ './views/About.vue')
      // }
    }
  ]
});
