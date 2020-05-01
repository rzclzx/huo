<template lang="html">
    <div class="">
        <Row>
           <Col style="margin-bottom:10px">
                <Input v-model="searchForm.searchCoin" :placeholder="$t('查询币种')" class="l-grouping-input" style="width: 150px"></Input>
                <Select v-model="searchForm.searchType" :placeholder="$t('状态')" style="width: 120px" v-autoLocale>
                    <Option v-for="(item, index) in searchTypeArr" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
                <Button type="primary" v-if="$store.state.user.checkPerm('withdraw:fees:list')" v-on:click="search">{{$t('查询')}}</Button>
           </Col>
        </Row>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        {{ $t('币种列表') }}
                        <span class="card-title-desc">
                            {{ $t('_coin_pre') }} {{ coinSatus.total }}{{ $t('_coin_tail') }}，
                            {{ $t('已上线') }} {{ coinSatus.onlineNum }}{{ $t('个') }}，
                            {{ $t('未上线') }} {{ coinSatus.offlineNum }}{{ $t('个') }}
                        </span>
                    </p>
                    <Row class="advanced-router">
                        <Table :columns="coinCols" :data="coinList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
                    </Row>
                    <div class="page-pane">
                        <Page show-elevator :total="coinPage.total" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getCurrencyList" size="small" show-total>
                            <slot>
                                {{ $t('共') + ' ' + coinPage.total+ ' ' + $t('条') }}
                            </slot>
                        </Page>
                    </div>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modalAdd" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ $t('币种设置') }}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="140" ref="formCoinEdit" :rules="rules">
                    <FormItem prop="koKr" :label="$t('韩文全称')">
                        <Input v-model="formItem.koKr"></Input>
                    </FormItem>
                    <FormItem prop="enUs" :label="$t('英文全称')">
                        <Input v-model="formItem.enUs"></Input>
                    </FormItem>
                    <FormItem prop="zhCn" :label="$t('中文全称')">
                        <Input v-model="formItem.zhCn"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="border-top: 0;text-align:center">
                    <Button type="primary" @click="saveCoin">{{ $t('保存') }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import { exchange } from '__util/api'
export default {
    components: {
    },
    data () {
        return {
            // 添加币种modal标题
            modalTitle: this.$t('添加币种'),
            // 查看的币种
            currCoin: {},
            modalAdd: false,
            // 是否可编辑
            isEdit: false,
            // 设置币种全称
            formItem: {
                koKr: '',
                zhCn: '',
                enUs: '',
                id:'',
                currency:'',
                visible: null
            },
            // 查询的输入框
            searchForm:{},
            // 表单验证
            rules: {
                koKr: [
                    { required: true, message: this.$t('韩文全称不能为空'), trigger: 'blur' },
                ],
                enUs: [
                    { required: true, message: this.$t('英文全称不能为空'), trigger: 'blur' },
                ],
                zhCn: [
                    { required: true, message: this.$t('中文全称不能为空'), trigger: 'blur' },
                ]
            },
            // 查询选择框
            searchTypeArr: [
                {
                    value: ' ',
                    label: '全部'
                },
                {
                    value: 1,
                    label: '未上线'
                },
                {
                    value: 0,
                    label: '已上线'
                }
            ],
            // 币种分页参数
            coinPage: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            // 币种列表columns
            coinCols: [
                {
                    renderHeader: (h) => {
                        return this.$t('币种名称')
                    },
                    key: 'currency'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    render: (h, params) => {
                        return params.row.visible ? this.$t('未上线') : this.$t('已上线')
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('修改时间')
                    },
                    render: (h, params) => {
                        return this.$moment(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('韩文全称')
                    },
                    key: 'koKr'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('中文全称')
                    },
                    key: 'zhCn'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('英文全称')
                    },
                    key: 'enUs'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('exchange["操作人"]')
                    },
                    key: 'adminName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('币种设置')
                    },
                    render: (h, params) => {
                        let edit = {
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
                                    this.CoinDialog(params.row)
                                }
                            }
                        }
                        if ( !this.$store.state.user.checkPerm('pro:currency:name:edit') ) {
                            edit.props.disabled = true
                            edit.style.color = '#bbbec4'
                            edit.style.cursor = 'not-allowed'
                        }
                        return h('div',[
                            h('Button', edit, this.$t('编辑'))
                        ])
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('开关')
                    },
                    render: (h, params) => {
                        if (this.$store.state.user.checkPerm('pro:currency:name:visible') && params.row.visible) {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.formItem = {...params.row}
                                        this.$Modal.confirm({
                                            title: this.$t('确认'),
                                            okText: this.$t('确认'),
                                            content: this.$t('确认开启'),
                                            onOk: this.controlCoin
                                        })
                                    }
                                }
                            }, this.$t('开启'))
                        } else if (this.$store.state.user.checkPerm('pro:currency:name:visible') && !params.row.visible) {
                            return h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.formItem = {...params.row}
                                        this.$Modal.confirm({
                                            title: this.$t('确认'),
                                            okText: this.$t('确认'),
                                            content: this.$t('确认关闭'),
                                            onOk: this.controlCoin
                                        })
                                    }
                                }
                            }, this.$t('关闭'))
                        }
                    }
                }
            ],
            // 币种列表
            coinList: [],
            coinSatus: {
                total: 0,
                onlineNum: 0,
                offlineNum: 0
            }
        }
    },
    mounted () {
        // if ( this.$store.state.user.checkPerm('pro:settings:currency:list') ) {
            this.getProCoinMsg()
        // }
        if ( this.$store.state.user.checkPerm('pro:currency:name:list') ) {
            this.getCurrencyList()
        }
    },
    methods: {
        // 查询
        search () {
            this.getCurrencyList(1)
        },
        // 获取币种个数信息
        getProCoinMsg () {
            // exchange.getProCoinMsg.data = {...this.formItem}
            this.$axios(exchange.getProCoinMsg).then((res) => {
                this.coinSatus = {...res.data}
            })
        },
        // 开启币种
        controlCoin () {
            exchange.controlProCoin.data = {...this.formItem}
            exchange.controlProCoin.data.visible = exchange.controlProCoin.data.visible ? 0 : 1
            this.$axios(exchange.controlProCoin).then((res) => {
                this.$Message.success(this.$t('成功'));
                this.getProCoinMsg()
                this.getCurrencyList()
            })
        },
        // 显示编辑币种弹框
        CoinDialog(data) {
            this.initForm()
            this.modalAdd = true
            this.formItem = {...data}
        },
        // 保存币种设置
        saveCoin () {
            this.$refs['formCoinEdit'].validate((valid) => {
                if (valid) {
                    exchange.SetProCoin.data = {...this.formItem}
                    this.$axios(exchange.SetProCoin).then((res) => {
                        this.modalAdd = false
                        this.initForm()
                        this.$Message.success(this.$t('保存成功'));
                        this.getCurrencyList()
                    })
                } else {
                    this.$Message.error(this.$t('表单验证不通过!'));
                }
            })
        },
        // 初始化表单
        initForm () {
            this.formItem = {
                koKr: '',
                zhCn: '',
                enUs: '',
                id:'',
                currency:'',
                visible: null
            }
            this.$refs.formCoinEdit.resetFields()
        },
        // 获取币种列表
        getCurrencyList (pages) {
            exchange.getProCoinList.params = {
                page: pages ? pages : this.coinPage.currPage,
                limit: this.coinPage.pageSize,
                currency: this.searchForm.searchCoin,
                visible: this.searchForm.searchType
            }
            this.$axios(exchange.getProCoinList).then((res) => {
                // this.coinSatus.total = res.data.total
                // this.coinSatus.onlineNum = res.data.onlineNum
                // this.coinSatus.offlineNum = res.data.offlineNum
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.total = res.data.totalCount
                this.coinList = res.data.list
            })
        },
        viewCoinAdd () {
            this.modalTitle = this.$t('添加币种')
        },
        editCoin (item) {
            this.currCoin = item
            this.modalTitle = this.$t('修改币种')
            this.$refs['coinAdd'].getCurrencyInfo(item.id)

            // if ( this.$store.state.user.checkPerm('pro:settings:currency:currencyInfo') ) {
            //     this.$refs['coinAdd'].getCurrencyInfo(item.id)
            // }
        },
    },
    watch: {
    }
}
</script>

<style lang="less">

</style>
