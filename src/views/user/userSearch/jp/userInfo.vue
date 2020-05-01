<template>
    <Tabs v-model="id">
        <TabPane :label="$t('账号信息')" name="0" v-if="$store.state.user.checkPerm('user:mgt:query:account')">
            <accountInfo :userId="userId" v-if="id == '0'"></accountInfo>
        </TabPane>
        <TabPane :label="$t('资产信息')" name="1" v-if="$store.state.user.checkPerm('user:mgt:query:asset')">
            <assetInfo v-if="id == '1'" :userId="userId"></assetInfo>
        </TabPane>
        <TabPane :label="$t('财务记录')" name="2" v-if="$store.state.user.checkPerm('user:mgt:query:fince')">
            <finance :userId="userId" v-if="id == '2'"></finance>
        </TabPane>
        <TabPane :label="$t('委托记录')" name="3" v-if="$store.state.user.checkPerm('user:mgt:query:entrust')">
            <entrust :userId="userId" v-if="id == '3'"></entrust>
        </TabPane>
        <TabPane :label="$t('成交记录')" name="4" v-if="$store.state.user.checkPerm('user:mgt:query:complete')">
            <trade :userId="userId" v-if="id == '4'"></trade>
        </TabPane>
        <TabPane :label="$t('安全信息')" name="5" v-if="$store.state.user.checkPerm('user:mgt:query:security')">
            <safety :userId="userId" v-if="id == '5'"></safety>
        </TabPane>
        <TabPane :label="$t('用户备注类型设置')" name="6" v-if="$store.state.user.checkPerm('user:mgt:query:note')">
            <remark v-if="id == '6'"></remark>
        </TabPane>
    </Tabs>
</template>
<script>
import accountInfo from './infoComponents/accountInfo.vue'
import assetInfo from './infoComponents/assetInfo.vue'
import finance from './infoComponents/finance.vue'
import entrust from './infoComponents/entrust.vue'
import trade from './infoComponents/trade.vue'
import safety from './infoComponents/safety.vue'
import remark from './infoComponents/remark.vue'
export default {
    name: 'userInfo',
    data () {
        return {
            id: '0',
            userId: ''
        }
    },
    created () {
        this.userId = this.$route.params.id
    },
    components: {
        accountInfo,
        assetInfo,
        finance,
        entrust,
        trade,
        safety,
        remark
    },
    methods: {
        aaa () {
            console.log(this.id)
        }
    }
}
</script>
