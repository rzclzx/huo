<template lang="html">
    <Tabs value="name1">
        <TabPane :label="$t('当日转化')" v-if="$store.state.user.checkPerm('statistics:tablistConversion')" name="name1"><day-trans></day-trans></TabPane>
        <TabPane :label="$t('七日转化')" v-if="$store.state.user.checkPerm('statistics:tablistConversion7')" name="name2"><week-trans></week-trans></TabPane>
    </Tabs>
</template>

<script>
import dayTrans from "./dayTrans"
import weekTrans from "./weekTrans"
export default {
    components: {
        dayTrans,
        weekTrans
    }
}
</script>
