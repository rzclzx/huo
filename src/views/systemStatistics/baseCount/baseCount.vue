<template lang="html">
    <div class="">
        <Tabs value="name1">
            <TabPane v-if="$store.state.user.checkPerm('statistics:tablistBase')" :label="$t('Pro基础报表')" name="name1"><pro-base></pro-base></TabPane>
            <TabPane v-if="$store.state.user.checkPerm('statistics:tablistDetail')" :label="$t('Pro细则报表')" name="name2"><pro-info></pro-info></TabPane>
        </Tabs>
    </div>
</template>

<script>
import proBase from "./proBase"
import proInfo from "./proInfo"
export default {
    components: {
        proBase,
        proInfo
    }
}
</script>

<style lang="css">
</style>
