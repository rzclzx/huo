<template lang="html">
    <Tabs value="name1">
        <TabPane v-if="$store.state.user.checkPerm('statistics:tabgetTradeNumber')" :label="$t('交易人数')" name="name1"><trans-num></trans-num></TabPane>
        <TabPane v-if="$store.state.user.checkPerm('statistics:tabgetTradeFee')" :label="$t('交易手续费')" name="name2"><trade-charge></trade-charge></TabPane>
        <TabPane v-if="$store.state.user.checkPerm('statistics:tabgetAssets')" :label="$t('资产日报')" name="name3"><daily></daily></TabPane>
    </Tabs>
</template>

<script>
import tradeCharge from "./tradeCharge"
import transNum from "./transNum"
import daily from "./digitalCount/dailyCount"

export default {
    components: {
        tradeCharge,
        transNum,
        daily
    }
}
</script>

<style lang="css">
</style>
