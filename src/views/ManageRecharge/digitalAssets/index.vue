<template>
    <Tabs value="firstTrial" @on-click="clickTab">
        <TabPane v-if="$store.state.user.checkPerm('withdraw:fCheck')" :label="$t ('提币初审')" name="firstTrial">
            <FirstTrial ref="firstTrial"/>
        </TabPane>
        <TabPane v-if="$store.state.user.checkPerm('withdraw:rCheck')" :label="$t ('提币复审')" name="reviewTrial">
            <ReviewTrial ref="reviewTrial"/>
        </TabPane>
        <TabPane v-if="$store.state.user.checkPerm('withdraw:query')" :label="$t ('提币查询')" name="searchTrial">
            <SearchTrial/>
        </TabPane>
        <TabPane v-if="$store.state.user.checkPerm('withdraw:refuse:setting')" :label="$t ('拒绝理由设置')" name="refuseConfig">
            <RefuseConfig/>
        </TabPane>
    </Tabs>
</template>

<script>
    import FirstTrial from '__views/ManageRecharge/digitalAssets/firstTrial';
    import ReviewTrial from '__views/ManageRecharge/digitalAssets/reviewTrial';
    import SearchTrial from '__views/ManageRecharge/digitalAssets/searchTrial';
    import RefuseConfig from '__views/ManageRecharge/digitalAssets/refuseConfig';
    import AutoSwitch from '__views/ManageRecharge/digitalAssets/autoSwitch';
    export default {
        name: "digital-assets",
        components: {
            FirstTrial,
            ReviewTrial,
            SearchTrial,
            RefuseConfig,
            AutoSwitch
        },
        methods: {
            clickTab (name) {
                if ( name === 'firstTrial' || name === 'reviewTrial' ) {
                    this.$refs[name].searchData()
                }
            }
        }

    }
</script>

<style type="less">
    .ivu-tabs-bar{
        background-color: #ffffff;
    }
</style>
