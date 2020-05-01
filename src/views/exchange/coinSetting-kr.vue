<template lang="html">
    <div class="">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        {{ $t('币种列表') }}
                        <span class="card-title-desc" v-if="$store.state.user.checkPerm('pro:settings:currency:statusCount')">{{ $t('共') }}{{ coinSatus.totalCount }}{{ $t('个') }}{{ $t('币种') }}，{{ $t('已上线') }}{{ coinSatus.alreadyOnlineCount }}{{ $t('个') }}，未上线{{ coinSatus.notOnlineCount }}个</span>
                    </p>
                    <Button slot="extra" type="primary" @click.prevent="viewCoinAdd" v-if="$store.state.user.checkPerm('pro:settings:currency:updateSimple')">{{ $t('添加币种') }}</Button>
                    <Row type="flex" justify="center" align="middle" class="advanced-router">
                        <Table :columns="coinCols" :data="coinList" style="width: 100%;"></Table>
                    </Row>
                    <div class="page-pane">
                        <Page show-elevator :total="coinPage.total" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getCurrencyList" size="small" show-total>
                            <slot>
                                {{ $t('共') + ' ' + coinPage.total + ' ' + $t('条') }}
                            </slot>
                        </Page>
                    </div>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modalAdd" width="800" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ modalTitle }}{{ $t('币种') }}</span>
            </p>
            <div style="text-align:center">
                <coin-add ref="coinAdd" @on-close="closeModal"></coin-add>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
        <coin-desc :show="modalDesc" :coin="currCoin" @on-close="closeDesc"></coin-desc>
    </div>
</template>

<script>
import coinAdd from "./coinAdd"
import coinDesc from "./coinDesc"
import { exchange } from '__util/api'
export default {
    components: {
        coinAdd,
        coinDesc
    },
    data () {
        return {
            // 添加币种modal标题
            modalTitle: this.$t('添加'),
            // 控制币种介绍
            modalDesc: false,
            // 查看的币种
            currCoin: {},
            modalAdd: false,
            // 币种分页参数
            coinPage: {
                currPage: 1,
                pageSize: 10,
                totalPage: 1
            },
            // 币种列表columns
            coinCols: [
                {
                    renderHeader: (h) => {
                        return this.$t('币种名称')
                    },
                    key: 'value'
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
                        return this.$t('操作人')
                    },
                    key: 'adminName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('币种介绍')
                    },
                    key: 'id',
                    render: (h, params) => {
                        let option = {
                            props: {
                                type: 'text'
                            },
                            style: {
                                color: '#1991EB',
                                cursor: 'pointer',
                                padding: 0
                            },
                            on: {
                                click: () => {
                                    this.viewCoinDesc(params.row)
                                }
                            }
                        }
                        if ( !this.$store.state.user.checkPerm('pro:currency:introduction:select:list') ) {
                            option.props.disabled = true
                            option.style.color = '#bbbec4'
                            option.style.cursor = 'not-allowed'
                        }
                        return h('Button', option, this.$t('查看/编辑'))
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    key: 'desc',
                    render: (h, params) => {
                        let option = {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.editCoin(params.row)
                                }
                            }
                        }
                        if ( !this.$store.state.user.checkPerm('pro:settings:currency:updateSimple') ) {
                            option.props.disabled = true
                        }
                        return h('Button', option, this.$t('修改'))
                    }
                }
            ],
            // 币种列表
            coinList: [],
            coinSatus: {
                totalCount: 0,
                alreadyOnlineCount: 0,
                notOnlineCount: 0
            }
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('pro:settings:currency:statusCount') ) {
            this.getStatusCount()
        }
        if ( this.$store.state.user.checkPerm('pro:settings:currency:list') ) {
            this.getCurrencyList()
        }
    },
    methods: {
        // 获取币种状态信息
        getStatusCount () {
            this.$axios(exchange.getCurrencyCount).then((res) => {
                this.coinSatus = res.data
            })
        },
        // 获取币种列表
        getCurrencyList (page) {
            exchange.getCurrencyList.path = {
                page: page ? page : this.coinPage.currPage,
                limit: this.coinPage.pageSize
            }
            this.$axios(exchange.getCurrencyList).then((res) => {
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.total = res.data.totalCount
                this.coinList = res.data.list
            })
        },
        // 显示币种介绍
        viewCoinDesc (item) {
            this.modalDesc = true
            this.currCoin = item
        },
        viewCoinAdd () {
            this.modalAdd = true
            this.modalTitle = this.$t('添加')
        },
        editCoin (item) {
            this.modalAdd = true
            this.currCoin = item
            this.modalTitle = this.$t('修改')
            this.$refs['coinAdd'].getCurrencyInfo(item.id)
            // if ( this.$store.state.user.checkPerm('pro:settings:currency:currencyInfo') ) {
            //     this.$refs['coinAdd'].getCurrencyInfo(item.id)
            // }
        },
        // 关闭币种添加modal
        closeModal (status) {
            this.modalAdd = false
            if ( status === 'success' ) {
                this.getCurrencyList(1)
            }
        },
        // 关闭币种介绍modal
        closeDesc () {
            this.modalDesc = false
        }
    },
    watch: {
        modalAdd (val) {
            if ( !val ) {
                this.$refs['coinAdd'].closeModal()
            }
        }
    }
}
</script>

<style lang="less">

</style>
