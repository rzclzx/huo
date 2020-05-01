<style lang="less" scope>
@import '../../../assets/style/public.less';
</style>
<template>
    <Tabs v-model="id">
        <TabPane v-if="$store.state.user.checkPerm('risk:management:blacklist')" :label="$t('用户黑名单列表')" name="0">
            <list></list>
        </TabPane>
        <!-- <TabPane v-if="$store.state.user.checkPerm('risk:management:freezeBlack')" :label="$t('批量冻结')" name="1">
            <freeze></freeze>
        </TabPane> -->
        <!-- <TabPane v-if="$store.state.user.checkPerm('risk:management:thawBlack')" :label="$t('批量解冻')" name="2">
            <unfreeze></unfreeze>
        </TabPane> -->
        <TabPane :label="$t('批量操作')" name="3">
            <operator></operator>
        </TabPane>

    </Tabs>
</template>
<script>
import list from './blackComponents/list.vue'
import freeze from './blackComponents/freeze.vue'
import unfreeze from './blackComponents/unfreeze.vue'
import operator from './blackComponents/operator.vue'

export default {
    data () {
        return {
            id: '0'
        }
    },
    components: {
        list,
        freeze,
        unfreeze,
        operator
    },
    methods: {

    }
}
</script>
