<style lang="less" scope>
@import '../../../assets/style/public.less';
</style>
<template>
    <Tabs :value="id">
        <TabPane :label="$t('特殊提现额度管理')" name="0" v-if="$store.state.user.checkPerm('risk:specialAmountManager')">
            <limit></limit>
        </TabPane>
        <TabPane :label="$t('特殊额度用户列表')" name="1" v-if="$store.state.user.checkPerm('risk:specialAmountUser:list')">
            <user></user>
        </TabPane>
    </Tabs>
</template>
<script>
import limit from './specialComponents/limit.vue'
import user from './specialComponents/user.vue'
export default {
    data () {
        return {
            id: '0'
        }
    },
    created () {

    },
    components: {
        limit,
        user
    },
    methods: {

    }
}
</script>
