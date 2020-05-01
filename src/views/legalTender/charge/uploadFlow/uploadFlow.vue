<template lang="html">
    <Card>
        <Tabs>
            <TabPane :label="$t('上传流水单')" name="0" v-if="$store.state.user.checkPerm('manuallegal:hbuploadbankflow:upload')">
                <Upload></Upload>
            </TabPane>
            <TabPane :label="$t('新建流水单')" name="1" v-if="$store.state.user.checkPerm('manuallegal:hbuploadbankflow:save')">
                <Create></Create>
            </TabPane>
            <TabPane :label="$t('导出')" name="2" v-if="$store.state.user.checkPerm('manuallegal:hbuploadbankflow:execl')">
                <Except></Except>
            </TabPane>
        </Tabs>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{ $t('操作记录') }}
            </p>
            <Row>
                <Table :columns="columns" :data="tableData" :no-data-text="$t('暂无数据')"></Table>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="getRecord" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.total+ ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
    </Card>
</template>

<script>
import Create from './create.vue'
import Upload from './upload.vue'
import Except from './except.vue'
import { legalTender } from '__util/api';

export default {
    components: {
        Create,
        Upload,
        Except
    },
    data () {
        return {
            page: {
                total: 0,
                pageSize: 10,
                currPage: 1
            },
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('时间')
                    },
                    key: 'createTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作人')
                    },
                    key: 'operator'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('上传成功')
                    },
                    key: 'success'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('上传失败')
                    },
                    key: 'failure'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('上传文件')
                    },
                    key: 'fileName'
                },
            ],
            tableData: []
        }
    },
    mounted () {
        if(this.$store.state.user.checkPerm('manuallegal:hbuploadbankflow:record')){
            this.getRecord()
        }

       
    },
    methods: {
        // 获取操作记录
        getRecord (page) {
            let option = {...legalTender.uploadFlow.record}
            option.data = {
                limit: this.page.pageSize,
                page: page ? page : this.page.currPage
            }
            if ( page ) {
                this.page.currPage = page
            }
            this.$axios(option).then(res => {
                this.tableData = res.data.list
                this.page.total = res.data.total
            })
        }
    }
}
</script>

<style lang="css">
</style>
