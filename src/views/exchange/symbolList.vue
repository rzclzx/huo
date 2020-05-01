<template lang="html">
    <div class="">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        {{ $t('本地站交易对') }}
                        <span class="card-title-desc">
                            {{ $t('_coin_pre') }} {{ coinSatus.totalCount }}{{ $t('_symbol_tail') }}，
                            {{ $t('已上线') }} {{ coinSatus.alreadyOnlineCount }}{{ $t('个') }}，
                            {{ $t('未上线') }} {{ coinSatus.notOnlineCount }}{{ $t('个') }}
                        </span>
                    </p>
                    <Button slot="extra" type="primary" @click.prevent="viewSymbolAdd" v-if="$store.state.user.checkPerm('pro:settings:symbol:updateSimple')">{{ $t('添加交易对') }}</Button>
                    <Row type="flex" justify="center" align="middle" class="advanced-router">
                        <Table :columns="columns" :data="symbolList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
                    </Row>
                    <div class="page-pane">
                        <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="getSymbol" size="small" show-total>
                            <slot>
                                {{ $t('共') + ' ' + page.total + ' ' + $t('条') }}
                            </slot>
                        </Page>
                    </div>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modalAdd" width="800" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ modalTitle }}{{ $t('交易对') }}</span>
            </p>
            <div style="text-align:center">
                <symbol-add ref="symbolAdd" @on-close="closeModal"></symbol-add>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>

<script>
import { exchange } from '__util/api'
import symbolAdd from './symbolAdd'
export default {
    components: {
        symbolAdd
    },
    data () {
        return {
            // 添加币种modal标题
            modalTitle: this.$t('添加'),
            // 交易对分页参数
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            modalAdd: false,
            // 交易对列表columns
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('交易对名称')
                    },
                    render: (h, params) => {
                        return JSON.parse(params.row.rules).symbolName
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'showEnable',
                    render: (h, params) => {
                        return params.row.showEnable ? this.$t('已上线') : this.$t('未上线')
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('修改时间')
                    },
                    key: 'updateTime',
                    width: 200
                },
                {
                    renderHeader: (h) => {
                        return this.$t('排序权重')
                    },
                    key: 'weight'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('exchange["操作人"]')
                    },
                    key: 'adminName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('exchange["操作"]')
                    },
                    key: 'id',
                    render: (h, params) => {
                        let option = {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.edit(params.row)
                                }
                            }
                        }
                        if ( !this.$store.state.user.checkPerm('pro:settings:symbol:updateSimple') ) {
                            option.props.disabled = true
                        }
                        return h('Button', option, this.$t('修改'))
                    }
                }
            ],
            // 币种列表
            symbolList: [],
            currSymbol: {},
            coinSatus: {
                totalCount: 0,
                alreadyOnlineCount: 0,
                notOnlineCount: 0
            }
        }
    },
    mounted () {
        // if ( this.$store.state.user.checkPerm('pro:settings:symbol:statusCount') ) {
            this.getStatusCount()
        // }
        if ( this.$store.state.user.checkPerm('pro:settings:symbol:list') ) {
            this.getSymbol()
        }
    },
    methods: {
        // 获取币种状态信息
        getStatusCount () {
            this.$axios(exchange.getStatusCount).then((res) => {
                this.coinSatus = res.data
            })
        },
        // 查询交易对
        getSymbol (page) {
            exchange.getSymbolList.path = {
                page: page ? page : this.page.currPage,
                limit: this.page.pageSize
            }
            this.$axios(exchange.getSymbolList).then((res) => {
                this.page.currPage = res.data.currPage
                this.page.pageSize = res.data.pageSize
                this.page.total = res.data.totalCount
                this.symbolList = res.data.list
            })
        },
        // 打开添加交易对页面
        viewSymbolAdd () {
            this.modalAdd = true
            this.modalTitle = this.$t('添加')
        },
        // 修改交易对
        edit (item) {
            this.modalAdd = true
            this.currSymbol = item
            this.modalTitle = this.$t('修改')
            this.$refs['symbolAdd'].getSymbolInfo(item.id)
            // if ( this.$store.state.user.checkPerm('pro:settings:symbol:symbolInfo') ) {
            //     this.$refs['symbolAdd'].getSymbolInfo(item.id)
            // }
        },
        // 关闭币种添加modal
        closeModal (status) {
            this.modalAdd = false
            if ( status === 'success' ) {
                this.getSymbol(1)
            }
        }
    },
    watch: {
        modalAdd (val) {
            if ( !val ) {
                this.$refs.symbolAdd.closeModal()
            }
        }
    }
}
</script>

<style lang="css">
</style>
