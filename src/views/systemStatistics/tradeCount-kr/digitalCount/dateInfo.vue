<template lang="html">
    <div>
        <Card>
            <p slot="title">
                {{$t('资产日报详情')}}
            </p>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:getTradeFeeExport')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="columns" ref="tableExcel" :data="listBase" style="width: 100%;"></Table>
            </Row>
        </Card>
    </div>
</template>

<script>
import { statistics } from '__util/api'

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
                        return this.$t('转入')
                    },
                    key: 'inSum'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('转出')
                    },
                    key: 'outSum'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('用户资产')
                    },
                    key: 'pocketBalanceChange'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('用户资产变动')
                    },
                    key: 'pocketBalanceSum'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('钱包余额')
                    },
                    key: 'propertyChange'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('钱包余额变动')
                    },
                    key: 'propertySum'
                }
            ],
            dataList: []
        }
    },
    props: ['listBase'],
    mounted () {
    },
    methods: {
        // 数据导出
        dataExport () {

        }
    }
}
</script>

<style lang="css">
</style>
