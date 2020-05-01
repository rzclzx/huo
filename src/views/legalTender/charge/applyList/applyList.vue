<template lang="html">
    <div class="">
        <Row type="flex" :gutter="20">
            <Col>
                <Input v-model="formItem.uid" :placeholder="$t('UID')"></Input>
            </Col>
            <Col>
                <Select v-model="formItem.payBank" :placeholder="$t('付款银行')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.bankCode" v-if="item.bankCode" v-for="item in bankList">{{ item.bankName }}</Option>
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
                    :placeholder="$t('申请时间-起 - 申请时间-止')"
                    @on-change="dateChange"
                ></DatePicker>
            </Col>
        </Row>
        <Row type="flex" :gutter="20" style="margin-top: 20px">
            <Col>
                <Input v-model="formItem.addAmount" :placeholder="$t('金额')"></Input>
            </Col>
            <Col>
                <Input v-model="formItem.id" :placeholder="$t('ID')"></Input>
            </Col>
            <Col>
                <Input v-model="formItem.verCode" :placeholder="$t('备注码')"></Input>
            </Col>
            <Col>
                <Select v-model="formItem.status" :placeholder="$t('状态')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.status" v-for="item in statusArr">{{ $t(item.label) }}</Option>
                </Select>
            </Col>
            <Col>
                <Select v-model="formItem.matchMsg" :placeholder="$t('系统提示')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.msg" v-for="item in sysMsg">{{ $t(item.label) }}</Option>
                </Select>
            </Col>
            <Col>
                <Button type="primary" @click.prevent="search()" v-if="$store.state.user.checkPerm('manuallegal:hbdepositapply:list')">{{$t('查询')}}</Button>
            </Col>
            <!-- <Col>
                <Button type="ghost" @click.prevent="formItem = {}">{{$t('重置')}}</Button>
            </Col> -->
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{ $t('充值申请单') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="add" v-if="$store.state.user.checkPerm('manuallegal:hbdepositapply:save')">{{ $t('添加') }}</Button>
            <Row>
                <expandTable :columns="columns" :data="tableData">
                    <template slot-scope="props">
                        <MoreInfo :data="props.row" :defaultInfo="props.row._defaultTab"></MoreInfo>
                    </template>
                </expandTable>
            </Row>
            <div class="page-pane">
                <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="search" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.total+ ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Drawer v-model="drawerShow" width="800px" placement="right">
            <p slot="header">{{ $t('添加充值单清单') }}</p>
            <ApplyListAdd @close="addPaneClose" ref="addPane"></ApplyListAdd>
        </Drawer>
        <Drawer v-model="drawerMatch" width="80%" placement="right">
            <p slot="header">{{ $t('与银行流水号匹配') }}</p>
            <Match @close="drawerMatch = false" :applyId="applyId" ref="matchPane"></Match>
        </Drawer>
    </div>
</template>

<script>
import Drawer from '__components/drawer.vue'
import ApplyListAdd from './applyListAdd.vue'
import MoreInfo from './moreInfo.vue'
import Match from './match.vue'
import expandTable from '__components/expandTable.vue'
import { legalTender } from '__util/api';

export default {
    components: {
        Drawer,
        ApplyListAdd,
        expandTable,
        MoreInfo,
        Match
    },
    data () {
        return {
            formItem: {
              status:2
            },
            rules: [],
            // 控制添加申请单
            drawerShow: false,
            // 控制匹配抽屉
            drawerMatch: false,
            // 匹配的申请单id
            applyId: null,
            page: {
                total: 0,
                pageSize: 10,
                currPage: 1
            },
            // 系统提示
            sysMsg: [
                {msg: 1, label: '匹配成功'},
                {msg: 3, label: '姓名错误'},
                {msg: 4, label: '付款银行错误'},
                {msg: 5, label: '付款银行账号错误'},
                {msg: 6, label: '金额错误'}
            ],
            // 状态列表
            statusArr: [
                {status: 1, label: '待确认'},
                {status: 2, label: '待匹配'},
                {status: 3, label: '撤销'},
                {status: 4, label: '匹配成功'},
                {status: 5, label: '上账成功'},
                {status: 6, label: '匹配待审核'},
                {status: 7, label: '取消'},
                {status: 8, label: '超时取消'},
                {status: 9, label: '匹配中'},
                {status: 10, label: '匹配失败'},
            ],
            rangeDate: [],
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('ID')
                    },
                    width: '70px',
                    key: 'id'
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
                        return this.$t('UID')
                    },
                    width: '100px',
                    key: 'uid'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('姓名')
                    },
                    width: '100px',
                    key: 'payName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('付款银行')
                    },
                    render: (h, params) => {
                        for (let item of this.bankList) {
                            if ( item.bankCode === params.row.payBank ) {
                                return item.bankName
                            }
                        }
                        return params.row.payBank
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('付款银行账号')
                    },
                    width: '160px',
                    key: 'payBankAccount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('申请金额')
                    },
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
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('系统提示')
                    },
                    // key: 'msg',
                    render: (h, params) => {
                        for (let item of this.sysMsg) {
                            if ( item.msg.toString() === params.row.msg ) {
                                return this.$t(item.label)
                            }
                        }
                        return '-'
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width: '200px',
                    render: (h, params) => {
                        const doms = [];
                        const row = params.row
                        // 待匹配、待匹配
                        if ( row.status === 2 || row.status === 1 || row.status === 8 ) {
                            // 权限判断
                            if (this.$store.state.user.checkPerm('manuallegal:hbdepositapply:info')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            if ( row._expand ) {
                                                this.expandStatus(row)
                                            } else {
                                                this.viewMore(row)
                                            }
                                        }
                                    }
                                }, row._expand ? this.$t('收起') : this.$t('更多')))
                            }
                            if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplymatch:match')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.matching(row)
                                        }
                                    }
                                }, this.$t('匹配')))
                            }
                            if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplymatch:cancel') && params.row.status != 8) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.cancel(row)
                                        }
                                    }
                                }, this.$t('取消')))
                            }
                            if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplymatch:undo') && params.row.status === 8) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.recovery(row)
                                        }
                                    }
                                }, this.$t('恢复')))
                            }
                        }
                        if ( (row.status === 4 || row.status === 5) && this.$store.state.user.checkPerm('manuallegal:hbdepositapply:info') ) {
                            doms.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '15px',
                                    width: '96px'
                                },
                                on: {
                                    click: () => {
                                        if ( row._expand ) {
                                            this.expandStatus(row)
                                        } else {
                                            this.viewMore(row)
                                        }
                                    }
                                }
                            }, row._expand ? this.$t('收起') : this.$t('查看更多')))
                        // }
                        }
                        if ( row.status === 3 || row.status === 7 ) {
                            if (this.$store.state.user.checkPerm('manuallegal:hbdepositapply:info')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '15px',
                                        width: '96px'
                                    },
                                    on: {
                                        click: () => {
                                            if ( row._expand ) {
                                                this.expandStatus(row)
                                            } else {
                                                this.viewMore(row)
                                            }
                                        }
                                    }
                                }, row._expand ? this.$t('收起') : this.$t('查看更多')))
                            }
                            if (this.$store.state.user.checkPerm('manuallegal:hbdepositapplymatch:undo')) {
                                doms.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.recovery(row)
                                        }
                                    }
                                }, this.$t('恢复')))
                            }
                        }
                        return h(
                            'div',
                            doms
                        );
                    }
                }
            ],
            tableData: [],
            bankList: []
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('manuallegal:hbdepositapply:list') ) {
            this.search()
        }
    },
    methods: {
        // 查询申请单
        search (page) {
            let option = {...legalTender.chargeManage.applyList}
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
                    item._expand = false
                }
            })
        },
        // 获取申请单详情
        getApplyInfo (row) {
            let option = {...legalTender.chargeManage.getInfo}
            option.path = {
                id: row.id
            }
            this.$axios(option).then(res => {
                // 添加数据
                for (let item of this.tableData) {
                    if ( row.id === item.id ) {
                        let obj = Object.assign({}, item, {_expandData: res.data})
                        this.tableData.splice(this.tableData.indexOf(item), 1,obj)
                    }
                }
            })
        },
        // 添加
        add () {
            this.drawerShow = true
        },
        // 更多
        // more (row) {
        //     this.expandStatus(row)
        //     this.getApplyInfo(row)
        // },
        // 匹配
        matching (row) {
            this.drawerMatch = true
            this.applyId = row.id
        },
        // 取消
        cancel (row) {
            this.$Modal.confirm({
                title: this.$t('取消充值申请单'),
                content: this.$t('确认要取消此充值申请单？'),
                onOk: () => {
                    let option = {...legalTender.chargeManage.cancelApply}
                    option.path = {
                        id: row.id
                    }
                    this.$axios(option).then(res => {
                        this.search()
                        this.$Message.success(this.$t('操作成功'))
                    })
                }
            })
        },
        // 查看更多
        viewMore (row) {
            this.expandStatus(row)
            this.getApplyInfo(row)
        },
        // 控制展开状态
        expandStatus (row) {
            for (let item of this.tableData) {
                if ( row.id === item.id ) {
                    if ( item._expand === undefined ) {
                        item._expand = true
                    }
                    // 控制默认tab 状态
                    item._defaultTab = 'matchInfo'
                    if ( item.status === 7 || item.status === 8 || item.status === 3 ) {
                        item._defaultTab = 'other'
                    }
                    let obj = Object.assign({}, item, {_expand: !item._expand})
                    this.tableData.splice(this.tableData.indexOf(item), 1,obj)
                }
            }
        },
        // 恢复
        recovery (row) {
            this.$Modal.confirm({
                title: this.$t('恢复充值申请单'),
                content: this.$t('确认要恢复此充值申请单？'),
                onOk: () => {
                    let option = {...legalTender.chargeManage.undoApply}
                    option.path = {
                        id: row.id
                    }
                    this.$axios(option).then(res => {
                        this.search()
                        this.$Message.success(this.$t('操作成功'))
                    })
                }
            })
        },
        // 关闭添加申请单窗口
        addPaneClose (isUpdateList) {
            this.drawerShow = false
            if ( isUpdateList ) {
                // this.search()
            }
        },
        dateChange (val) {
            this.formItem.startDate = val[0]
            this.formItem.endDate = val[1]
        }
    },
    watch: {
        drawerMatch (val) {
            if (!val) {
                this.$refs['matchPane'].initForm()
            }
        },
        drawerShow (val) {
            if (!val) {
                this.$refs['addPane'].initForm()
            }
        },
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
