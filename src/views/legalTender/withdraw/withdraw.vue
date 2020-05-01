<template lang="html">

<div>

    <Tabs :value="defaultTab" @on-click="clickTab">

        <TabPane :label="$t('提现初审')" name="name1" v-if="$store.state.user.checkPerm('tab:legal:withdrawls:trial')">

                <first></first>

        </TabPane>
        <TabPane :label="$t('提现复审')" name="name2" v-if="$store.state.user.checkPerm('tab:legal:withdrawls:review')">

            <review  ></review>

        </TabPane>
        <TabPane :label="$t('提现查询')" name="name3" v-if="$store.state.user.checkPerm('tab:legal:withdrawls:query')">
            <query  ></query>
        </TabPane>
        <TabPane :label="$t('待付款列表')" name="nwaitlist" v-if="$store.state.user.checkPerm('tab:legal:withdrawls:wait')">

            <withdrawls-query></withdrawls-query>
        </TabPane>

         <TabPane :label="$t('拒绝理由')" name="refuse" v-if="$store.state.user.checkPerm('tab:legal:withdrawls:refuse')">
            <refuse-reason></refuse-reason>
        </TabPane>

    </Tabs>
</div>

</template>

<script>
import first from './firstApproval'
import review from './review'
import query from './query'
import refuseReason from './refuse-reason'
import withdrawlsQuery from './withdrawls-query'
export default {
    components: {
        first,
        review,
        query,
        refuseReason,
        withdrawlsQuery
    },
    data () {
        return {
            defaultTab: 'name1'
        }
    },
    mounted () {},
    methods: {
        clickTab (name) {
            this.defaultTab=name
            // if ( name === 'name2' ) {
            // }
        }
    }
}
</script>

<style lang="css">
</style>
