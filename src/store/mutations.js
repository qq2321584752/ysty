export default {
    // 获取采集器
    collector(state, res) {
        state.cjq_list = res
        state.cjq_mr = res[0].addr
        // console.log(state.cjq_list);
    },
    // 获取采集器实时数据
    collector_data(state, res) {

        res.labels.forEach(item => {

            item.src = require(`../assets/img/${item.elementId}.png`);
            // console.log(item.src);

        });

        var obj = { ...res }
        state.cjq_data = obj

    },


    // 保存全局网关序列号
    gserial(state, res) {
        // console.log(res);
        state.gserial = res
    },
    warning_list(state, res) {
        state.warning_data = res

    },
    // 提交所有网关列表
    user_gateway(state, res) {
        state.user_gateway_list = res
        // console.log(state.user_gateway_list);

    },
    // 获取当前网关下的报警信息首次
    warning_all(state, res) {
        state.warning_full_msg = res
        // console.log(state.warning_full_msg);


    },
    // 获取网关下的区域信息
    region_list(state, res) {
        state.region_List = res
        // console.log(state.region_List);
    },
    // 根据区域信息获取 元素
    ele_mutations(state, res) {
        state.ele_list = res
    }
}