<template lang="html">
    <div class="">
        <Row type="flex" :gutter="20">
            <Col>
                <Input v-model="formItem.uid" :placeholder="$t('UID')"></Input>
            </Col>
            <Col>
                <Select v-model="formItem.payBank" :placeholder="$t('付款银行')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.bankCode" v-for="item in bankList">{{ item.bankName }}</Option>
                </Select>
            </Col>
            <Col>
                <Input v-model="formItem.payBankAccount" :placeholder="$t('付款银行账号')"></Input>
            </Col>
            <Col>
                <Input v-model="formItem.name" :placeholder="$t('姓名')"></Input>
            </Col>
            <Col>
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 280px"
                    :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                    @on-change="dateChange"
                ></DatePicker>
            </Col>
        </Row>
        <Row type="flex" :gutter="20" style="margin-top: 20px">
            <Col>
                <Input v-model="formItem.addAmount" :placeholder="$t('金额')"></Input>
            </Col>
            <Col>
                <Select v-model="formItem.status" :placeholder="$t('状态')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.status" v-for="item in statusArr">{{ $t(item.label) }}</Option>
                </Select>
            </Col>
            <Col>
                <Input v-model="formItem.id" :placeholder="$t('ID')"></Input>
            </Col>
            <Col>
                <Button type="primary" @click.prevent="search()" v-if="$store.state.user.checkPerm('manuallegal:hbdepositapplyreview:list')">{{$t('查询')}}</Button>
            </Col>
            <!-- <Col>
                <Button type="ghost" @click.prevent="formItem = {}">{{$t('重置')}}</Button>
            </Col> -->
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{ $t('充值申请单') }}
            </p>
            <Row>
                <Table :columns="columns" :data="tableData" :no-data-text="$t('暂无数据')"></Table>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="search" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.total+ ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Drawer :show="drawerView" @close="drawerView = false" width="80%" placement="right">
            <p slot="header" style="textAlign: center">{{ $t('充值申请单复审') }}</p>
            <ViewPane @close="drawerView = false" :data="viewData" ref="viewPane" @refuse="refuse" @pass="pass"></ViewPane>
        </Drawer>
    </div>
</template>

<script>
import Drawer from '__components/drawer.vue'
import ViewPane from './view.vue'
import { legalTender } from '__util/api'

export default {
    components: {
        Drawer,
        ViewPane
    },
    data () {
        return {
            formItem: {},
            rangeDate: [],
            drawerView: false,
            page: {
                total: 0,
                pageSize: 10,
                currPage: 1
            },
            reviewStatus: [
                {status: 1, label: '待匹配'},
                {status: 2, label: '已通过'},
                {status: 3, label: '已拒绝'}
            ],
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('ID')
                    },
                    width: '80px',
                    key: 'id'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('UID')
                    },
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('姓名')
                    },
                    key: 'payName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('银行')
                    },
                    key: 'payBank'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('银行账号')
                    },
                    width: '100px',
                    key: 'payBankAccount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('申请时间')
                    },
                    width: '100px',
                    key: 'applyTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('申请金额')
                    },
                    width: '100px',
                    key: 'depositAmount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('备注码')
                    },
                    key: 'verCode'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    render: (h, params) => {
                        for (let i = 0; i < this.statusArr.length; i++) {
                            if ( this.statusArr[i].status === params.row.status ) {
                                return this.$t(this.statusArr[i].label)
                            }
                        }
                        return '-'
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('匹配流水')
                    },
                    key: 'remark'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width: '200px',
                    render: (h, params) => {
                        const doms = [];
                        const row = params.row
                        // 权限判断
                        if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplyreview:info')) {
                            doms.push(h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '15px'
                                },
                                on: {
                                    click: () => {
                                        this.view(row)
                                    }
                                }
                            }, this.$t('查看')))
                        }
                        if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplyreview:reject') && params.row.status != 5) {
                            doms.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '15px'
                                },
                                on: {
                                    click: () => {
                                        this.refuse(row)
                                    }
                                }
                            }, this.$t('拒绝')))
                        }
                        if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplyreview:accept') && params.row.status != 5) {
                            doms.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.pass(row)
                                    }
                                }
                            }, this.$t('通过')))
                        }
                        return h(
                            'div',
                            doms
                        );
                    }
                }
            ],
            statusArr: [
                // {status: 1, label: '待确认'},
                // {status: 2, label: '待匹配'},
                // {status: 3, label: '撤销'},
                {status: 4, label: '匹配成功'},
                {status: 5, label: '上账成功'},
                {status: 6, label: '匹配待审核'}
            ],
            tableData: [],
            bankList: [],
            // 查询数据
            viewData: null
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('manuallegal:hbdepositapplyreview:list') ) {
            this.search()
        }
    },
    methods: {
        search (page) {
            let option = {...legalTender.applyReview.reviewList}
            option.data = {...this.formItem}
            option.data.limit = this.page.pageSize
            option.data.page = page ? page : this.page.currPage
            this.$axios(option).then(res => {
                this.page.currPage = res.data.currPage
                this.page.total = res.data.totalCount
                this.tableData = res.data.list
                for (let item of this.tableData) {
                    // 没有数据的情况赋值
                    for (let key in item) {
                        if ( !item[key] ) {
                            item[key] = '-'
                        }
                    }
                }
            })
        },
        // 拒绝
        refuse (row) {
            this.$Modal.confirm({
                title: this.$t('拒绝'),
                content: this.$t('确定要拒绝这次匹配？'),
                onOk: () => {
                    setTimeout(() => {
                        let option = {...legalTender.applyReview.refuse}
                        option.path = {
                            id: row.id
                        }
                        this.$axios(option).then(res => {
                            this.search()
                            this.$Message.success(this.$t('操作成功'))
                        })
                    }, 300);
                }
            })
        },
        // 通过
        pass (row) {
            this.$Modal.confirm({
                title: this.$t('通过'),
                content: this.$t('确定要通过这次匹配？匹配成功直接上账'),
                onOk: () => {
                    setTimeout(() => {
                        let option = {...legalTender.applyReview.pass}
                        option.path = {
                            id: row.id
                        }
                        this.$axios(option).then(res => {
                            this.search()
                            this.$Message.success(this.$t('操作成功'))
                        })
                    }, 300)
                }
            })
        },
        // 查看
        view (row) {
            // this.drawerView = true
            // this.$refs['viewPane'].getInfo(row.id)
            this.$refs['viewPane'].setRow(row)
            this.getInfo(row)
        },
        // 查看详情
        getInfo (row) {
            let option = {...legalTender.applyReview.info}
            option.path = {
                id: row.id
            }
            this.$axios(option).then(res => {
                this.drawerView = true
                this.viewData = res.data
                this.viewData.rowData = row
            })
        },
        dateChange (val) {
            this.formItem.startDate = val[0]
            this.formItem.endDate = val[1]
        }
    },
    watch: {
        '$store.state.app.payBankList': {
            handler (val) {
                this.bankList = val
            },
            deep: true
        }
    }
}
</script>

<style lang="css">
</style>
