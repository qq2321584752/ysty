export default {
    // 获取采集器
    collector(state, res) {
        state.cjq_list = res
        state.cjq_mr = res[0].addr
        // console.log(state.cjq_mr);
    },
    // 获取采集器实时数据
    collector_data(state, res) {
        console.log(res);

        res.labels.forEach(item => {

            item.src = require(`../assets/img/${item.elementId}.png`);
            // console.log(item.src);

        });

        var obj = { ...res }
        obj.labels = obj.labels.splice(0, 4)
        state.cjq_data = obj


    }
}