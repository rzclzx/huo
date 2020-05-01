<template lang="html">
    <div class="">
        <Tabs value="name1">
            <TabPane :label="$t('资产概览')" name="name1"><asset-overview></asset-overview></TabPane>
            <!-- <TabPane v-if="$store.state.user.checkPerm('statistics:tablistDetail')" :label="$t('Pro细则报表')" name="name2"></TabPane> -->
        </Tabs>
    </div>
</template>

<script>
import assetOverview from "./assetOverview"

export default {
    components: {
        assetOverview
    }
}
</script>

<style lang="css">
</style>
