<template>
    <Tabs v-model="id">
        <TabPane :label="$t('账号信息')" name="0" v-if="$store.state.user.checkPerm('user:mgt:query:account')">
            <accountInfo v-if="id == '0'" :uid="parseInt(uid)"></accountInfo>
        </TabPane>
        <TabPane :label="$t('资产信息')" name="1" v-if="$store.state.user.checkPerm('user:mgt:query:asset')">
            <assetInfo v-if="id == '1'" :uid="parseInt(uid)"></assetInfo>
        </TabPane>
        <TabPane :label="$t('userInfo_财务记录')" name="2" v-if="$store.state.user.checkPerm('user:mgt:query:fince')">
            <finance v-if="id == '2'" :uid="parseInt(uid)"></finance>
        </TabPane>
        <TabPane :label="$t('委托记录')" name="3" v-if="$store.state.user.checkPerm('user:mgt:query:entrust')">
            <entrust v-if="id == '3'" :uid="parseInt(uid)"></entrust>
        </TabPane>
        <TabPane :label="$t('成交记录')" name="4" v-if="$store.state.user.checkPerm('user:mgt:query:complete')">
            <trade v-if="id == '4'" :uid="parseInt(uid)"></trade>
        </TabPane>
        <TabPane :label="$t('安全信息')" name="5" v-if="$store.state.user.checkPerm('user:mgt:query:security')">
            <safety v-if="id == '5'" :uid="parseInt(uid)"></safety>
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
            uid: ''
        }
    },
    created () {
        this.uid = this.$route.params.id
        if (!this.$store.state.user.checkPerm('user:mgt:query:account')){
            if (this.$store.state.user.checkPerm('user:mgt:query:asset')){
                this.id = 1
            } else if (this.$store.state.user.checkPerm('user:mgt:query:fince')) {
                this.id = 2
            } else if (this.$store.state.user.checkPerm('user:mgt:query:entrust')) {
                this.id = 3
            } else if (this.$store.state.user.checkPerm('user:mgt:query:complete')) {
                this.id = 4
            } else if (this.$store.state.user.checkPerm('user:mgt:query:security')) {
                this.id = 5
            } else if (this.$store.state.user.checkPerm('user:mgt:query:note')) {
                this.id = 6
            }
        }

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
