<template lang="html">
    <div class="">
        <Row type="flex" :gutter="20">
            <Col>
                <Select v-model="formItem.bankCode" :placeholder="$t('收款银行')" @on-change="bankChange" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.bankCode" v-for="item in bankList">{{ item.bankName }}</Option>
                </Select>
            </Col>
            <Col>
                <Select v-model="formItem.receiptAccountId" :placeholder="$t('收款账号')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.id" v-for="item in accountList">{{ item.accountNumber }}</Option>
                </Select>
            </Col>
            <Col>
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 280px"
                    :placeholder="$t('打款时间-起--打款时间-止')"
                    @on-change="payDateChange"
                ></DatePicker>
            </Col>
            <Col>
                <DatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placement="bottom-end"
                    transfer
                    style="width: 280px"
                    :placeholder="$t('最后操作时间-起--最后操作时间-止')"
                    @on-change="operDateChange"
                ></DatePicker>
            </Col>
        </Row>
        <Row type="flex" :gutter="20" style="margin-top: 20px">
            <Col>
                <Select v-model="formItem.state" :placeholder="$t('状态')" style="width: 141px" v-autoLocale>
                    <Option value="">{{ $t('全部') }}</Option>
                    <Option :value="item.status" v-for="item in statusArr">{{ $t(item.label) }}</Option>
                </Select>
            </Col>
            <Col>
                <Button type="primary" @click.prevent="search()" v-if="$store.state.user.checkPerm('manuallegal:hbuploadbankflow:query')">{{$t('查询')}}</Button>
            </Col>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{ $t('') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="except" v-if="$store.state.user.checkPerm('manuallegal:hbuploadbankflow:execl')">{{ $t('导出') }}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
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
    </div>
</template>

<script>
import { legalTender } from '__util/api';

export default {
    data () {
        return {
            formItem: {},
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('时间')
                    },
                    width: '100px',
                    key: 'createTime'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('最后操作时间')
                    },
                    width: '100px',
                    key: 'updateTime'
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
                    key: 'payBankName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('付款银行账号')
                    },
                    key: 'payBankAccount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('到账金额')
                    },
                    key: 'payAmount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('上账金额')
                    },
                    key: 'addAmount'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('备注码')
                    },
                    key: 'verCode'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('收款开户名')
                    },
                    key: 'accountName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('收款银行')
                    },
                    key: 'bankName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('收款银行账号')
                    },
                    key: 'bankNumber'
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
                }
            ],
            tableData: [],
            rangeDate: [],
            operateDate: [],
            statusArr: [
                {status: 1, label: '待匹配'},
                {status: 2, label: '已匹配'},
                {status: 3, label: '已退款'},
                {status: 4, label: '不处理'},
                {status: 5, label: '匹配中'},
                {status: 6, label: '上账成功'}
            ],
            page: {
                total: 0,
                pageSize: 10,
                currPage: 1
            },
            bankList: this.$store.state.app.bankList,
            accountList: [],
        }
    },
    methods: {
        search (page) {
            let option = {...legalTender.uploadFlow.list}
            option.data = {...this.formItem}
            option.data.limit = this.page.pageSize
            option.data.page = this.page.currPage - 1
            this.$axios(option).then(res => {
                this.tableData = res.data.list
                this.page.total = res.data.total
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
        except () {
            let option = {...legalTender.uploadFlow.except}
            option.data = {...this.formItem}
            option.data.limit = this.page.pageSize
            option.data.page = this.page.currPage
            this.$axios(option).then(res => {
                window.open( res.data )
            })
        },
        bankChange (bankCode) {
            // 不得不说  这个传惨   真难使，为什么不能直接给我返回object
            for (let item of this.bankList) {
                if ( item.bankCode === bankCode ) {
                    this.accountList = item.accountArr
                }
            }
        },
        payDateChange (val) {
            this.formItem.payBeginTime = val[0]
            this.formItem.payEndTime = val[1]
        },
        operDateChange (val) {
            this.formItem.operateBeginTime = val[0]
            this.formItem.operateEndTime = val[1]
        }
    }
}
</script>

<style lang="css">
</style>
