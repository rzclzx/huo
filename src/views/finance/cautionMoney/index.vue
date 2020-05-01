<template lang="html">
    <Tabs :value="defaultTab" @on-click="clickTab">
        <!-- <TabPane :label="$t('韩国站存在PRO站的保证金')" name="krpro" v-if="$store.state.user.checkPerm('tab:legal:hbreceiptaccount:bank')"><bank-account></bank-account></TabPane> -->
        <TabPane :label="$t('韩国站存在PRO站的保证金')" v-if="$store.state.user.checkPerm('tab:fince:margin:mgtInPro')" name="krpro">
            <kr-pro></kr-pro>
        </TabPane>
        <TabPane :label="$t('PRO站存在韩国站的保证金')" v-if="$store.state.user.checkPerm('tab:fince:margin:proInMgt')" name="prokr">
            <pro-kr></pro-kr>
        </TabPane>

        <TabPane :label="$t('历史记录')" name="history" v-if="$store.state.user.checkPerm('tab:fince:transfer:history')">
            <history></history>
        </TabPane>
    </Tabs>
</template>

<script>
import KrPro from './krpro'
import ProKr from './prokr'
import history from './history'

// import salesManage from './salesManage'
export default {
    components: {
        KrPro,
        ProKr,
        history
        // bankAccount,
        // salesManage
    },
    data () {
        return {
            defaultTab: 'krpro'
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
