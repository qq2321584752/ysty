import Qs from 'qs'
export default {

    async collector(context, res) {
        context.commit('collector', res.datas)
        // console.log(context, res.datas);

    },
    async collector_data(context, payload) {
        // console.log(payload);

        let { data: res } = await this.$http.post('/data/realtime', Qs.stringify(payload))
        context.commit('collector_data', res)

        console.log(res);


    }


}