<template>
    <div>
        <Tabs value="userLimit">
            <TabPane :label="$t('用户额度触发设置')" v-if="$store.state.user.checkPerm('tab:legal:withdrawlegalsetting')" name="userLimit">
                <user-limit/>
            </TabPane>
            <TabPane :label="$t('提现额度组')" v-if="$store.state.user.checkPerm('tab:legal:withdrawlegalgroup')" name="currencyLimit">
                <currency-limit/>
            </TabPane>
            <TabPane :label="$t('额度组用户')" v-if="$store.state.user.checkPerm('tab:legal:withdrawlegalgroupuser')" name="currencyArrUser">
                <currency-arrUser/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>

import userLimit from './userLimit'
import currencyLimit from './currencyLimit'
import currencyArrUser from './currencyArrUser'

export default {
    data () {
        return {
            
        }
    },
    components: {
        userLimit,
        currencyLimit,
        currencyArrUser
    },
    methods: {
    },
    created (){
    }
}
</script>
<style scoped>
</style>
