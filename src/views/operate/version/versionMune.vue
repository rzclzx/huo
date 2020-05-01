<template>
    <Tabs>
        <TabPane v-if="$store.state.user.checkPerm('tab:oper:hbterminalversion')" :label="$t('版本更新')" name="0">
            <Version/>
        </TabPane>
    </Tabs>
</template>

<script>
import Version from './versionNew.vue'

export default {
    components: {
        Version
    },
    mounted () {
    },
    methods: {
    }
}
</script>

<style>
</style>
