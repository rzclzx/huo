<template>
    <div>
        <Tabs value="serviceCharge">
            <TabPane :label="$t('通用交易手续费列表')" v-if="$store.state.user.checkPerm('trade:fee')" name="serviceCharge"><trade-list></trade-list></TabPane>
            <TabPane :label="$t('特殊费率分组管理')" v-if="$store.state.user.checkPerm('trade:fee:group')" name="specialRate"><special-rate></special-rate></TabPane>
            <TabPane :label="$t('提币手续费设置')" v-if="$store.state.user.checkPerm('withdraw:fees')" name="feeSetting"><fee-setting></fee-setting></TabPane>
        </Tabs>
    </div>
</template>

<script>

import tradeList from './tradeNumList'
import specialRate from './specialRate'
import feeSetting from './feeSetting'

export default {
    data () {
        return {
            
        }
    },
    components: {
        tradeList,
        specialRate,
        feeSetting
    },
    methods: {
    },
    created (){
    }
}
</script>
<style scoped>
</style>
