const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
// console.log(path);

module.exports = {
  publicPath: "./",
  assetsDir: "assets",
  // 关闭eslint规范
  lintOnSave: false,
  // 去除打包以后 的.map文件
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  // webpack打包配置
  configureWebpack: {
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter",
      // vuex: "Vuex",
      axios: "axios",
      echarts: "echarts"
    }
    // module: {
    //   rules: [
    //     {
    //       test: /\.m?js$/,
    //       //exclude用下面配置的话，默认是过滤不编译node_modules 路径下的文件
    //       //exclude: /(node_modules|bower_components)/,
    //       //include 指定需要编译的文件路径
    //       include: [
    //         resolve("src")
    //         // resolve("node_modules/tree-table-vue/lib"),
    //         // resolve("node_modules/v-org-tree/dist"),
    //         // resolve("node_modules/iview/src/locale")
    //       ],
    //       use: {
    //         loader: "babel-loader",
    //         options: {
    //           presets: ["@babel/preset-env"]
    //         }
    //       }
    //     }
    //   ]
    // }
  },
  // chainWebpack: config => {
  //   config.resolve.alias
  //     .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
  //     .set("_c", resolve("src/components"));
  // },
  // configureWebpack: config => {
  //   config.entry.app = ["babel-polyfill", "./src/main.js"];
  //   config.externals = {
  //     vue: "Vue",
  //     "vue-router": "VueRouter",
  //     // vuex: "Vuex",
  //     axios: "axios",
  //     echarts: "echarts"
  //   };
  // },
  devServer: {
    port: 3000, // 端口号
    host: "localhost",
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    proxy: "https://www.raintec.cn" // 配置跨域处理,只有一个代理
    // proxy: "https://192.168.1.109/" // 配置跨域处理,只有一个代理
    // proxy: {
    //   "/": {
    //     target: "https://192.168.1.109:8080/",
    //     ws: true,
    //     changeOrigin: true
    //     // pathRewrite: {
    //     //   "^/api": ""
    //     // }
    //   }
    // }
    // hot: true // 热加载
  }
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin() // 热更新插件
  // ]

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。
  // 如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  // transpileDependencies: [],
  // chainWebpack: config => {
  //   config.module
  //     .rule("compile")
  //     .test(/\.js$/)
  //     .include.add(resolve("src"))
  //     .add(resolve("test"))
  //     .add(resolve("node_modules/webpack-dev-server/client"))
  //     .add(resolve("node_modules"))
  //     .end()
  //     .use("babel")
  //     .loader("babel-loader")
  //     .options({
  //       presets: [
  //         [
  //           "@babel/preset-env",
  //           {
  //             modules: false
  //           }
  //         ]
  //       ]
  //     });
  // }
};
