import Qs from 'qs'
export default {
    // 获取采集器
    async collector(context, res) {
        context.commit('collector', res.datas)
        // console.log(context, res.datas);

    },
    // 获取采集器下的元素实时数据
    async collector_data(context, payload) {
        // console.log(payload);

        let { data: res } = await this.$http.post('/data/master', Qs.stringify(payload))
        context.commit('collector_data', res)

        // console.log(res);
    },
    // 点击全屏后获取所有元素的实时数据
    async collector_data_full(context, payload) {
        var arr = []

        // context.state.cjq_list.forEach(async item => {
        for (var i = 0; i < context.state.cjq_list.length; i++) {
            var obj = {
                gSerial: payload.gSerial,
                collectorAddr: context.state.cjq_list[i].addr
            }
            var { data: res } = await this.$http.post('/data/realtime', Qs.stringify(obj))
            arr.push(res)
        }

        context.commit('collector_data_full', arr)

        // });
        // console.log(arr);

        // console.log(context);

    },


    // 获取当前网关的报警日志
    async warning(context) {
        var obj = {
            gSerial: context.state.gserial
        }
        // console.log(obj);

        let { data: res } = await this.$http.post('/alermMsg/listByGSerial', Qs.stringify(obj))
        context.commit('warning_list', res)
        // console.log(res);


    },

    // 获取所选网关报警日志
    async warning_all(context, payload) {
        // var obj = {
        //     gSerial:payload.gSerial,
        // }
        let { data: res } = await this.$http.post('/alermMsg/listByGSerial', Qs.stringify(payload))
        // console.log(res, 11);
        context.commit('warning_all', res)

    },

    // 获取用户下所有的网关
    async user_gateway(context, payload) {
        var uId = JSON.parse(window.sessionStorage.getItem('user_info')).id
        // console.log(uid);

        let { data: res } = await this.$http(`/gateWay/listByUId/${uId}`)
        // console.log(res);

        context.commit('user_gateway', res.datas)
    },


    // 获取当前 网关下的区域信息
    async region_list(context, payload) {
        let { data: res } = await this.$http(`/regionInfo/list/${payload}`)
        context.commit('region_list', res.datas)
    },
    async ele_actions(context, payload) {
        let { data: res } = await this.$http.post(`/alermOrder/list`, Qs.stringify(payload))
        console.log(res);
        context.commit('ele_mutations', res.datas)

    }
    // 获取首次报警日志
    // async warning_ong() {

    // }


}