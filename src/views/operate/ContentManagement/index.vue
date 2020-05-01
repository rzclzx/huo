<template>
    <Tabs value="banner">
        <Tab-pane v-if="$store.state.user.checkPerm('content:banner')" :label="$t('Banner管理')" name="banner">
            <Banner/>
        </Tab-pane>
        <Tab-pane v-if="$store.state.user.checkPerm('content:banner')" :label="$t('AppBanner管理')" name="appBanner">
            <AppBanner/>
        </Tab-pane>
        <Tab-pane v-if="$store.state.user.checkPerm('content:download')" :label="$t('下载管理')" name="download">
            <Download/>
        </Tab-pane>
        <Tab-pane v-if="$store.state.user.checkPerm('tab:content:posters')" :label="$t('海报管理')" name="poster">
            <Poster/>
        </Tab-pane>
    </Tabs>
</template>

<script>
    import Banner from './banner';
    import AppBanner from './appBanner';
    import Download from './download';
    import Poster from './poster';
    export default {
        name: "content-management",
        components:{
            Banner,
            AppBanner,
            Download,
            Poster
        }
    }
</script>

<style scoped>

</style>
