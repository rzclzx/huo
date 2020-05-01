<template>
    <Tabs value="banner">
        <Tab-pane :label="$t('公告管理')" name="banner">
            <Notice/>
        </Tab-pane>
    </Tabs>
</template>

<script>
    import Notice from './notice';
    export default {
        name: "content-management",
        components:{
            Notice
        }
    }
</script>

<style scoped>

</style>
