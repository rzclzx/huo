<template lang="html">
    <Tabs value="name1">
        <TabPane v-if="$store.state.user.checkPerm('statistics:tabgetTradeNumber')" :label="$t('交易人数')" name="name1"><trans-num></trans-num></TabPane>
        <TabPane v-if="$store.state.user.checkPerm('statistics:tabgetTradeFee')" :label="$t('交易手续费')" name="name2"><trade-charge></trade-charge></TabPane>
    </Tabs>
</template>

<script>
import tradeCharge from "./tradeCharge"
import transNum from "./transNum"

export default {
    components: {
        tradeCharge,
        transNum
    }
}
</script>

<style lang="css">
</style>
