<style lang="less" scope>
@import '../../../assets/style/public.less';
</style>
<template>
    <Tabs :value="id">
        <TabPane label="自动提币额度设置" name="0">
            <limit></limit>
        </TabPane>
        <TabPane label="自动提币审核开关" name="1">
            <audit></audit>
        </TabPane>
    </Tabs>
</template>
<script>
import limit from './getLimitComponents/limit.vue'
import audit from './getLimitComponents/audit.vue'
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
        audit
    },
    methods: {
        
    }
}
</script>