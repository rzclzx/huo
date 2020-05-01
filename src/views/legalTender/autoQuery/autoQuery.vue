<template lang="html">
    <Tabs :value="defaultTab" @on-click="clickTab">
        <TabPane :label="$t('银行帐号')" name="backAccount" v-if="$store.state.user.checkPerm('tab:legal:hbreceiptaccount:bank')"><bank-account></bank-account></TabPane>
        <TabPane :label="$t('大客户管理')" name="salesManage" v-if="$store.state.user.checkPerm('tab:legal:hbreceipt:hbvipcustomer')"><sales-manage /></TabPane>
    </Tabs>
</template>

<script>
import bankAccount from './bankAccount'
import salesManage from './salesManage'
export default {
    components: {
        bankAccount,
        salesManage
    },
    data () {
        return {
            defaultTab: 'backAccount'
        }
    },
    mounted () {},
    methods: {
        clickTab (name) {
            // if ( name === 'name2' ) {
            // }
        }
    }
}
</script>

<style lang="css">
</style>
