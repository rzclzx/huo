<template lang="html">
    <div class="" style="margin-top: 20px">
        <Row type="flex" justify="center" align="middle" class="advanced-router">
            <Table :columns="cols" :data="tableData" style="width: 100%;"></Table>
        </Row>
        <div class="page-pane">
            <Button @click="pageChange('prev')" :disabled="page.currPage === 1" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
            <Button @click="pageChange('next')" :disabled="page.isLast" type="primary">{{$t('下一页')}}</Button>
        </div>
    </div>
</template>

<script>
import { finance } from '__util/api';

export default {
    data () {
        return {
            // 分页对象
            page: {},
            tableData: [],
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('UID')
                    },
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('币种ID')
                    },
                    key: 'currency'
                },
                {
                    renderHeader: (h) => {
                        return this.colName
                    },
                    key: 'amount'
                }
            ],
            columnsFee: [
                {
                    renderHeader: (h) => {
                        return this.$t('UID')
                    },
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('交易手续费')
                    },
                    key: 'amount'
                }
            ],
            cols: [],
            // 查询条件
            searchParams: {},
            colName: ''
        }
    },
    created () {
        this.initPage()
    },
    methods: {
        // 初始化分页对象
        initPage () {
            this.page = {
                currPage: 1,
                size: 11,
                direct: '',
                from: '',
                isLast: false
            }
        },
        // 更新数据
        update (param) {
            this.searchParams = param
            if ( param.type === 3 ) {
                this.cols = this.columnsFee
            } else {
                this.cols = this.columns
            }
            if ( param.type === 1 ) {
                this.colName = this.$t('充值数量')
            }
            if ( param.type === 2 ) {
                this.colName = this.$t('提现数量')
            }
            this.initPage()
            this.getTableData()
        },
        // 获取报表数据
        getTableData () {
            let request = {...finance.statements.detail}
            request.params = {...this.searchParams}
            request.params.from = this.page.from
            request.params.direct = this.page.direct
            request.params.size = this.page.size
            this.$axios(request).then((res) => {
                this.tableData = res.data
                // 分页最后一条
                let lastItem = {...res.data[res.data.length - 1]}
                this.page.from = lastItem.id
                if ( res.data.length < this.page.size ) {
                    this.page.isLast = true
                } else {
                    this.page.isLast = false
                }
                if ( res.data.length === 11 ) {
                    this.tableData.pop()
                }
            })
        },
        // 分页
        pageChange (dir) {
            this.page.direct = dir
            let from = ''
            if ( dir === 'next' ) {
                this.page.currPage++
            }
            if ( dir === 'prev' ) {
                this.page.from = this.tableData[0].id
                this.page.currPage--
            }
            this.getTableData()
        }
    }
}
</script>

<style lang="css">
</style>
