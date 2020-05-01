<template lang="html">
    <div class="">
        <Row :gutter="15" :class-name="'filter-group'">
            <Col span="3">
                <Select v-model="formItem.currency" class="l-select" filterable :placeholder="$t('选择币种')" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option v-for="item in currencyArr" :value="item.value" :key="item.value" v-show="item.value !== 'krw'">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="3">
                <DatePicker
                    format="yyyy-MM-dd"
                    type="date"
                    placement="bottom-end"
                    transfer
                    :placeholder="$t('日期')"
                    v-model="formItem.reportDate"
                    style="width: 100%">
                </DatePicker>
            </Col>
            <Col span="3">
                <Button type="primary" @click="getTableData">{{$t ('查询')}}</Button>
            </Col>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('财务报表')}}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="columns" :data="tableData" style="width: 100%;"></Table>
            </Row>
        </Card>
        <Drawer v-model="showDetail" width="80%" placement="right">
            <p slot="header">{{ detailTitle }}</p>
            <Detail ref="detail"></Detail>
        </Drawer>
    </div>
</template>

<script>
import { recharge } from '__util/api'
import Drawer from '__components/drawer.vue'
import Detail from './detail.vue'
import { finance } from '__util/api';

export default {
    components: {
        Drawer,
        Detail
    },
    data() {
        return {
            // 表单
            formItem: {},
            // 显示详情
            showDetail: false,
            // 详情标题
            detailTitle: '',
            // 币种
            currencyArr: [],
            // 报表数据
            tableData: [],
            // 表格列
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('日报数据')
                    },
                    render: (h, params) => {
                        return this.$t(this.reportType[params.row.reportType])
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('钱包')
                    },
                    className: 'noPadding-col',
                    render: (h, params) => {
                        if ( params.row.walletAmount === 0 ) {
                            return ''
                        }
                        return h('div', {
                            style: {
                                width: '100%',
                                height: '100%',
                                padding: '10px 18px',
                                cursor: (params.row.reportType !== 4 && params.row.reportType !== 5) ? 'pointer' : 'default',
                                color: (params.row.reportType !== 4 && params.row.reportType !== 5) ? '#57a3f3' : ''
                            },
                            on: {
                                click: () => {
                                    if ( params.row.reportType !== 4 && params.row.reportType !== 5 ) {
                                        this.toDetail(params.row, 1)
                                    }
                                }
                            }
                        }, params.row.walletAmount)
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('应付用户')
                    },
                    className: 'noPadding-col',
                    render: (h, params) => {
                        if ( params.row.payuserAmount === 0 ) {
                            return ''
                        }
                        return h('div', {
                            style: {
                                width: '100%',
                                height: '100%',
                                padding: '10px 18px',
                                cursor: (params.row.reportType !== 4 && params.row.reportType !== 5) ? 'pointer' : 'default',
                                color: (params.row.reportType !== 4 && params.row.reportType !== 5) ? '#57a3f3' : ''
                            },
                            on: {
                                click: () => {
                                    if ( params.row.reportType !== 4 && params.row.reportType !== 5 ) {
                                        this.toDetail(params.row, 2)
                                    }
                                }
                            }
                        }, params.row.payuserAmount)
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('交易手续费收入')
                    },
                    className: 'noPadding-col',
                    render: (h, params) => {
                        if ( params.row.tradefeeAmount === 0 ) {
                            return ''
                        }
                        return h('div', {
                            style: {
                                width: '100%',
                                height: '100%',
                                padding: '10px 18px',
                                cursor: (params.row.reportType !== 4 && params.row.reportType !== 5) ? 'pointer' : 'default',
                                color: (params.row.reportType !== 4 && params.row.reportType !== 5) ? '#57a3f3' : ''
                            },
                            on: {
                                click: () => {
                                    if ( params.row.reportType !== 4 && params.row.reportType !== 5 ) {
                                        this.toDetail(params.row, 3)
                                    }
                                }
                            }
                        }, params.row.tradefeeAmount)
                    }
                }
            ],
            // 日报数据类型
            reportType: {
                1: '充值',
                2: '提现',
                3: '手续费',
                4: '期初余额',
                5: '期末余额'
            }
        }
    },
    created () {
        this.getCurrencyList()
    },
    methods: {
        // 获取币种列表
        getCurrencyList () {
            this.$axios(recharge.getAllCurrency).then((res) => {
                res.data.map((e) => {
                    this.currencyArr.push({
                        label: e,
                        value: e
                    })
                })
            })
        },
        // 获取报表数据
        getTableData () {
            let request = {...finance.statements.list}
            if ( !this.formItem.currency || !this.formItem.reportDate ) {
                this.$Message.error({content: this.$t('请选择币种和日期')})
                return
            }
            request.params = {
                currency: this.formItem.currency,
                reportDate: this.$moment(this.formItem.reportDate).format('YYYYMMDD')
            }
            this.$axios(request).then((res) => {
                let arr = []
                res.data.map((item) => {
                    if ( item.reportType !== 4 && item.reportType !== 5 ) {
                        arr.push(item)
                    }
                    return item
                })
                res.data.map((item) => {
                    if ( item.reportType === 4 ) {
                        arr.unshift(item)
                    }
                    if ( item.reportType === 5 ) {
                        arr.push(item)
                    }
                    return item
                })
                this.tableData = arr
            })
        },
        // 跳转到详情页
        toDetail (row, type) {
            this.showDetail = true
            let text = {
                1: this.$t('充值明细'),
                2: this.$t('提出明细'),
                3: this.$t('交易手续费'),
            }
            this.detailTitle = `${this.$moment(this.formItem.reportDate).format('YYYY-MM-DD')} ${this.formItem.currency} ${text[row.reportType]}`
            this.$refs['detail'].update({
                type: row.reportType,
                reportDate: this.$moment(this.formItem.reportDate).format('YYYYMMDD'),
                currency: this.formItem.currency
            })
        }
    }
}
</script>

<style lang="less">
.ivu-table-body {
    .noPadding-col {
        padding: 0;
        .ivu-table-cell {
            width: 100%;
            height: 100%;
            padding: 0;
        }
    }
}
</style>
