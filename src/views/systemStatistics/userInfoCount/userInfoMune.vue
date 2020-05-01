<template>
    <Tabs value="register">
        <TabPane :label="$t('注册登录统计')" name="register" v-if="$store.state.user.checkPerm('statistics:tabgetRegLogin')">
            <RegisterAndLogin/>
        </TabPane>
        <TabPane :label="$t('交易信息统计')" name="tradeCount" v-if="$store.state.user.checkPerm('statistics:tabgetTradeInfo')">
            <TradeCount/>
        </TabPane>
        <TabPane :label="$t('充提信息统计')" name="depositCount" v-if="$store.state.user.checkPerm('statistics:tabgetWithdrawDeposit')">
            <DepositCount/>
        </TabPane>
    </Tabs>
</template>

<script>
import RegisterAndLogin from './registerLogin'
import TradeCount from './tradeCount'
import DepositCount from './depositCount'

export default {
    name: "userInfoCount",
    components:{
        RegisterAndLogin,
        TradeCount,
        DepositCount
    }
}
</script>

<style scoped>

</style>
