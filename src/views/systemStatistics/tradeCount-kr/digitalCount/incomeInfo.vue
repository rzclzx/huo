<template lang="html">
    <div>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('收入详情')}}
            </p>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:getTradeFeeExport')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="columns" ref="tableExcel" :data="listBase" style="width: 100%;"></Table>
            </Row>
        </Card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            formItem: {},
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('币种')
                    },
                    key: 'currency'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('交易手续费')
                    },
                    key: 'tradeFeeIn'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('提币手续费')
                    },
                    key: 'transferFeeIn'
                }
            ]
        }
    },
    props: ['listBase'],
    methods: {
        // 数据导出
        dataExport () {

        }
    }
}
</script>

<style lang="css">
</style>
