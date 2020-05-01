<template lang="html">
    <div class="">
        <Row type="flex" :gutter="20">
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
                <Input v-model="formItem.payAmount" :placeholder="$t('金额')"></Input>
            </Col>
            <Col>
                <Select v-model="formItem.status" :placeholder="$t('状态')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.status" v-for="item in statusArr">{{ $t(item.label) }}</Option>
                </Select>
            </Col>
            <Col>
                <Select v-model="formItem.matchMsg" :placeholder="$t('系统提示')" style="width: 200px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.msg" v-for="item in sysMsg">{{ $t(item.label) }}</Option>
                </Select>
            </Col>
        </Row>
        <Row type="flex" :gutter="20" style="margin-top: 20px">
            <Col>
                <Input v-model="formItem.depositBankId" :placeholder="$t('流水号')"></Input>
            </Col>
            <Col>
                <Input v-model="formItem.remark" :placeholder="$t('备注码')"></Input>
            </Col>
            <Col>
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 280px"
                    :placeholder="$t('申请时间-起 - 申请时间-止')"
                    v-model="rangeDate"
                ></DatePicker>
            </Col>
            <Col>
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 280px"
                    :placeholder="$t('到账时间-起--到账时间-止')"
                    v-model="rangeDateArrive"
                ></DatePicker>
            </Col>
            <Col>
                <Button type="primary" @click.prevent="search()" v-if="$store.state.user.checkPerm('manuallegal:hbdepositbankflow:list')">{{$t('查询')}}</Button>
            </Col>
        </Row>
        <Row type="flex" :gutter="20" style="margin-top: 20px">
            <!-- <Col>
                <Button type="ghost" @click.prevent="formItem = {}">{{$t('重置')}}</Button>
            </Col> -->
        </Row>
        <Card>
            <p slot="title">
                {{ $t('充值流水') }}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <expandTable :columns="columns" :data="tableData" style="width: 100%">
                    <template slot-scope="props">
                        <div v-if="props.row && props.row._expandData" v-for="item in props.row._expandData">
                            <Row :gutter="20" type="flex">
                                <Col span="8">
                                    <label>{{ $t('操作时间') }}：</label><span>{{ item && item.operTime }}</span>
                                </Col>
                            </Row>
                            <Row :gutter="20" type="flex" style="margin-top: 20px">
                                <Col span="8">
                                    <label>{{ $t('操作人') }}：</label><span>{{ item.operator }}</span>
                                </Col>
                                <Col span="8">
                                    <label>{{ $t('操作项') }}：</label><span>{{ item && operNames[item.operType-1].label }}</span>
                                </Col>
                            </Row>
                            <Row :gutter="20" type="flex" style="margin-top: 20px">
                                <Col span="8">
                                    <label>{{ $t('备注') }}：</label><span>{{ item.remark }}</span>
                                </Col>
                            </Row>
                        </div>
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
        <Modal v-model="modalStatus" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ $t('改变流水状态') }}</span>
            </p>
            <div>
                <Row style="text-align:center">
                    <RadioGroup v-model="formFlow.state">
                        <Radio :label="3">{{ $t('已退款') }}</Radio>
                        <Radio :label="4">{{ $t('不处理') }}</Radio>
                    </RadioGroup>
                </Row>
                <Row style="marginTop: 30px">
                    <Input v-model="formFlow.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('备注')"></Input>
                </Row>
                <div style="marginTop: 30px;text-align:center">
                    <Button type="ghost" @click="modalStatus = false" style="margin-right: 40px">{{ $t('取消') }}</Button>
                    <Button type="primary" @click="statusSub()">{{ $t('确认') }}</Button>
                </div>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>

<script>
import expandTable from '__components/expandTable.vue'
import { legalTender } from '__util/api';

export default {
    components: {
        expandTable
    },
    data () {
        return {
            formItem: {status: 1},
            formFlow: {state: 3},
            rules: [],
            page: {
                total: 0,
                pageSize: 10,
                currPage: 1
            },
            modalStatus: false,
            // 系统提示
            sysMsg: [
                {msg: 1, label: '匹配成功'},
                {msg: 2, label: '申请单不存在'},
                {msg: 3, label: '姓名错误'},
                {msg: 4, label: '付款银行错误'},
                {msg: 5, label: '付款银行账号错误'},
                {msg: 6, label: '金额错误'},
                {msg: 7, label: '匹配到多个申请单，人工处理'}
            ],
            // 状态列表
            statusArr: [
                {status: 1, label: '待匹配'},
                {status: 2, label: '已匹配'},
                {status: 3, label: '已退款'},
                {status: 4, label: '不处理'},
                {status: 5, label: '匹配中'},
                {status: 6, label: '上账成功'},
                {status: 7, label: '匹配失败'}
            ],
            // 来源
            source: [
                {num: 1, label: '操作员新增充值申请单'},
                {num: 2, label: '操作员匹配充值申请单'},
                {num: 3, label: '操作员取消充值申请单'},
                {num: 4, label: '操作员恢复充值申请单'},
                {num: 5, label: '操作员拒绝充值申请单'},
                {num: 6, label: '操作员通过充值申请单'},
            ],
            // 操作项
            operNames: [
              {key: 1, label: '置为待匹配'},
              {key: 2, label: '置为已匹配'},
              {key: 3, label: '置为已退款'},
              {key: 4, label: '置为不处理'},
              {key: 5, label: '置为匹配中'},
              {key: 6, label: '操作员新建流水单'},
              {key: 7, label: '操作员人工匹配审核-拒绝'},
              {key: 8, label: '操作员人工匹配审核-通过'},
              {key: 9, label: '操作员匹配充值银行流水单'},
              {key: 10, label: '操作员导入银行流水'},
              {key: 11, label: '系统匹配充值申请单'}
            ],
            rangeDate: [],
            rangeDateArrive: [],
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('ID')
                    },
                    width: '70px',
                    key: 'id'
                    // render: (h, params) => {
                    //     payBankCode
                    // }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('流水号')
                    },
                    render: (h, params) => {
                        return h('div',
                            [
                                h('span', {
                                    props: {
                                        id: 'copy_flow' + params.row.id
                                    },
                                    style: {

                                    },
                                    on: {
                                        click: () => {
                                            console.log(e,val)
                                            // Url2=document.getElementById("biao1");
                                            // Url2.select(); // 选择对象
                                            // document.execCommand("Copy");
                                        }
                                    }
                                }, params.row.id),
                                // h('Button', {
                                //     props: {
                                //         type: 'text',
                                //         size: 'small'
                                //     },
                                //     style: {
                                //         marginLeft: '15px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             let span = document.getElementById('copy_flow' + params.row.id)
                                //             console.log('复制', span)
                                //         }
                                //     }
                                // }, this.$t('复制'))
                            ]
                        )
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('姓名')
                    },
                    key: 'name'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('付款银行')
                    },
                    width: '100px',
                    key: 'payBankCode'
                    // render: (h, params) => {
                    //     payBankCode
                    // }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('付款银行账号')
                    },
                    width: '110px',
                    key: 'payBankAccount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('到账金额')
                    },
                    width: '100px',
                    key: 'payAmount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('备注码')
                    },
                    key: 'verCode'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('到账时间')
                    },
                    width: '100px',
                    key: 'arriveTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('上传时间')
                    },
                    width: '100px',
                    key: 'uploadTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('来源')
                    },
                    // key: 'sourceType'
                    render: (h, params) => {
                        return this.getSource(params.row.sourceType)
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    // key: 'status',
                    render: (h, params) => {
                        for (let item of this.statusArr) {
                            if ( params.row.status == item.status ) {
                                return this.$t(item.label)
                            }
                        }
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('系统提示')
                    },
                    width: '100px',
                    render: (h, params) => {
                        for (let i = 0; i < this.sysMsg.length; i++) {
                            if ( this.sysMsg[i].msg === params.row.matchMsg ) {
                                return this.$t(this.sysMsg[i].label)
                            }
                        }
                        return '-'
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width: '150px',
                    render: (h, params) => {
                        const doms = [];
                        const row = params.row
                        // 权限判断
                        if (this.$store.state.user.checkPerm('manuallegal:hbdepositbankflow:more')) {
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
                                            this.more(row)
                                        }
                                    }
                                }
                            }, row._expand ? this.$t('收起') : this.$t('更多')))
                        }
                        if (this.$store.state.user.checkPerm('manuallegal:hbdepositbankflow:updateState')) {
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
                                        this.changeStatus(row)
                                    }
                                }
                            }, this.$t('置为')))
                        }
                        return h(
                            'div',
                            doms
                        );
                    }
                }
            ],
            tableData: [],
            bankList: [],
            changeId: null
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('manuallegal:hbdepositbankflow:list') ) {
            this.search()
        }
    },
    methods: {
        // 查询申请单
        search (page) {
            let option = {...legalTender.bankFlow.flowList}
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
        getMoreInfo (row) {
            let option = {...legalTender.bankFlow.moreInfo}
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
        // 更多
        more (row) {
            this.expandStatus(row)
            this.getMoreInfo(row)
        },
        // 改变充值单状态
        changeStatus (row) {
            this.modalStatus = true
            // 修改的id
            this.changeId = row.id
        },
        // 提交状态
        statusSub () {
            let option = {...legalTender.bankFlow.updateStatus}
            option.data = {
                id: this.changeId,
                state: this.formFlow.state,
                remark: this.formFlow.remark
            }
            this.$axios(option).then(res => {
                this.modalStatus = false
                this.$Message.success({content: this.$t('操作成功')})
                this.search()
            })
        },
        // 控制展开状态
        expandStatus (row) {
            for (let item of this.tableData) {
                if ( row.id === item.id ) {
                    if ( item._expand === undefined ) {
                        item._expand = true
                    }
                    let obj = Object.assign({}, item, {_expand: !item._expand})
                    this.tableData.splice(this.tableData.indexOf(item), 1,obj)
                }
            }
        },
        getSource (num) {
            for (let item of this.source) {
                if ( num === item.num ) {
                    return this.$t(item.label)
                }
            }
        }
    },
    watch: {
        rangeDate (val) {
            if ( val[0] && val[1] ) {
                this.formItem.payTimeStr = this.$moment(val[0]).format()
                this.formItem.payTimeEnd = this.$moment(val[1]).format()
            } else {
                this.formItem.payTimeStr = ''
                this.formItem.payTimeEnd = ''
            }
        },
        rangeDateArrive (val) {
            if ( val[0] && val[1] ) {
                this.formItem.arriveTimeStr = this.$moment(val[0]).format()
                this.formItem.arriveTimeEnd = this.$moment(val[1]).format()
            } else {
                this.formItem.arriveTimeStr = ''
                this.formItem.arriveTimeEnd = ''
            }
        },
        modalStatus (val) {
            if (!val) {
                this.formFlow = {
                    state: 3
                }
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
