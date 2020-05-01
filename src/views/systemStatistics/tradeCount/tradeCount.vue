<template lang="html">
    <Tabs value="name1">
        <TabPane label="交易人数" name="name1" v-if="$store.state.user.checkPerm('statistics:tabgetTradeNumber')"><trans-num></trans-num></TabPane>
        <TabPane label="交易手续费" name="name2" v-if="$store.state.user.checkPerm('statistics:tabgetTradeFee')"><trade-charge></trade-charge></TabPane>
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
