<template lang="html">
    <div class="">
        <Tabs :value="defaultTab" @on-click="clickTab">
            <TabPane :label="$t('本地站交易对')" name="name1" v-if="$store.state.user.checkPerm('pro:trade')"><symbol-list></symbol-list></TabPane>
            <TabPane :label="$t('Pro站交易对')" name="tradepro" v-if="$store.state.user.checkPerm('tab:job:hbprosymbols')">
                <trade-pro ref="trade:pro"></trade-pro>
            </TabPane>
            <tabPane :label="$t('Hadax交易对')" name="hadax" v-if="$store.state.user.checkPerm('tab:job:hbhadaxsymbols')">
                <hadax-list ref="hadax"></hadax-list>
            </tabPane>
            <TabPane :label="$t('数字资产交易规则')" name="name2" v-if="$store.state.user.checkPerm('pro:operate:tradeRule')"><trading-rule ref="tabRule"></trading-rule></TabPane>
        </Tabs>
    </div>
</template>

<script>
import symbolList from "./symbolList"
import tradingRule from "./tradingRule"
import tradePro from './tradePro'
import hadaxList from './hadaxList'
export default {
    components: {
        symbolList,
        tradingRule,
        tradePro,
        hadaxList
    },
    data () {
        return {
            defaultTab: 'name1'
        }
    },
    mounted () {
        if (this.$route.path === '/symbolRule') {
            this.defaultTab = 'name2'
        } else {
            this.defaultTab = 'name1'
        }
    },
    methods: {
        clickTab (name) {
            if ( name === 'name2' ) {
                this.$refs['tabRule'].getSymbol()
            }
        }
    }
}
</script>

<style lang="less">

</style>
