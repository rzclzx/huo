<style lang="less" scope>
@import '../../../../../assets/style/layout.less';
@import '../../../../../assets/style/public.less';
.modal-content{
    margin: 30px auto;
    .flex-wrap-start-center;
    div{
        width: 20%;
        height: 60px;
        text-align: center;
        div{
            width: 120px;
            height: 40px;
            .border-gray-1;
            border-radius: 4px;
            font-size: 16px;
            line-height: 40px;
            .center;
            .pointer;
        }
    }
}
.current{
    .gray-current;
}
</style>
<template>
    <div>
        <div v-if="$store.state.user.checkPerm('user:mgt:query:fince:list')" class="flex-start-center" style="margin-top: 20px">
            <div style="width: 260px;margin-right: 10px">
                <Input v-model="currency" :placeholder="$t('币种查询')"></Input>
            </div>
            <Select v-model="type" style="width: 140px;margin-right: 10px" :placeholder="$t('请选择')" v-autoLocale>
                <Option :value="''">{{$t('全部')}}</Option>
                <Option :value="'withdraw-legal'">{{$t('法币提现')}}</Option>
                <Option :value="'deposit-legal'">{{$t('法币充值')}}</Option>
                <Option :value="'withdraw-virtual'">{{$t('数字货币提现')}}</Option>
                <Option :value="'deposit-virtual'">{{$t('数字货币充值')}}</Option>
                <Option :value="'transfer_in'">{{$t('平台转入')}}</Option>
                <Option :value="'transfer_out'">{{$t('平台转出')}}</Option>
                <Option :value="'assign'">{{$t('资金划转')}}</Option>
                <Option :value="'fork_transfer'">{{$t('分叉币转换')}}</Option>
            </Select>
            <Button @click="refresh" type="primary" style="margin-right: 10px" v-if="$store.state.user.checkPerm('user:mgt:query:fince:list')">{{$t('查询')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('userInfo_财务记录')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                    <Row style="margin-top: 10px">
                        <Col span="24">
                            <div class="flex-end-center">
                                <Button :disabled="!prevAllow" @click="pre" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                                <Button :disabled="!nextAllow" @click="next" type="primary">{{$t('下一页')}}</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'finance',
    data () {
        return {
            table0Cache: [],
            table0Date: [],
            table0Column: [],
            type: '',
            currency: '',
            direct: null,
            offset: null,
            size: 11,
            prevAllow: 0,
            nextAllow: false,
            // 类型
            typeArr: [
                {num: 'withdraw-virtual', label: '数字币提现'},
                {num: 'withdraw-legal', label: '法币提现'},
                {num: 'deposit-virtual', label: '数字币充值'},
                {num: 'deposit-legal', label: '法币充值'},
                {num: 'transfer_in', label: '平台转入'},
                {num: 'transfer_out', label: '平台转出'},
                {num: 'assign', label: '资金划转'},
                {num: 'fork_transfer', label: '分叉币转换'}
            ],
            // 渠道
            channelArr: [
                {num: 'withdraw-virtual', label: '网络转账'},
                {num: 'withdraw-legal', label: '转出到主账户'},
                {num: 'withdraw-legal', label: '转出到主账户'},
                {num: 'deposit-virtual', label: '网络转账'},
                {num: 'deposit-legal', label: '从主账户转入'},
                {num: 'bitex-to-bitexpro', label: '转出到专业站账户'},
                {num: 'bitexpro-to-bitex', label: '从专业站账户转入'},
                {num: 'oldhuobi-to-bitexpro', label: '从主站转入'},
                {num: 'bitexpro-to-oldhuobi', label: '转出到主站'},
                {num: 'pro-to-otc', label: '转出到OTC'},
                {num: 'pro-to-kr', label: '从PRO转出到KR'},
                {num: 'otc-to-pro', label: '从OTC转入'},
                {num: 'kr-to-pro', label: '从KR转入PRO'},
                {num: 'marketing-account-transfer-in', label: '从活动账户转入'},
                {num: 'rebate-account-transfer-in', label: '从返佣账户转入'},
                {num: 'operations-account-loan-to-user-trade', label: '从运营账户转入'},
                {num: 'operations-account-expenditure', label: '从运营账户转入'},
                {num: 'operations-account-earning', label: '转出到运营账户'},
                {num: 'operations-account-recycling-user-trade-principal', label: '转出到运营账户'},
                {num: 'operations-account-deposit-compensate-expenditure', label: '从运营账户转入'},
                {num: 'operations-account-withdraw-compensate-expenditure', label: '从运营账户转入'},
                {num: 'operations-account-deposit-compensate-earning', label: '转出到运营账户'},
                {num: 'operations-account-withdraw-compensate-earning', label: '转出到运营账户'},
                {num: 'inspire-account-to-user-trade', label: '从激励账户转入'},
                {num: 'user-trade-to-inspire-account', label: '转出到激励账户'},
                {num: 'fork-transfer-in', label: '分叉币转换生成'},
                {num: 'fork-transfer-out', label: '分叉币转换消耗'},
                {num: 'margin-transfer-in', label: '转入到借贷账户'},
                {num: 'margin-transfer-out', label: '从借贷账户转出'}
            ],
            // 状态
            stausArr: [
                {num: 'confirming', label: '确认中'},
                {num: 'confirmed', label: '已确认上账'},
                {num: 'orphan', label: '区块被孤立'},
                {num: 'orphan-confirming', label: '孤立确认中'},
                {num: 'orphan-confirmed', label: '孤立已确认'},
                {num: 'rollback-orphan', label: '已孤立取消上帐'},
                {num: 'rollback-confirming', label: '取消后再确认中'},
                {num: 'rollback-confirmed', label: '取消后再次确认上帐'},
                {num: 'safe', label: '已确认上账'},
                {num: 'orphan-safe', label: '孤立已确认'},
                {num: 'rollback-safe', label: '取消后再次确认上帐'},
                {num: 'reexamine', label: '待复审'},
                {num: 'pre-submitted', label: '待提交'},
                {num: 'invalid', label: '错误'},
                {num: 'submitted', label: '待审核'},
                {num: 'canceled', label: '已撤销'},
                {num: 'pass', label: '审核通过'},
                {num: 'reject', label: '审核未通过'},
                {num: 'pre-transfer', label: '钱包处理中'},
                {num: 'wallet-transfer', label: '钱包已汇出'},
                {num: 'wallet-reject', label: '钱包拒绝'},
                {num: 'confirmed', label: '区块已确认'},
                {num: 'confirm-error', label: '区块确认错误'},
                {num: 'repealed', label: '人工撤销'},
                {num: 'pre-submitted', label: '待提交'},
                {num: 'invalid', label: '错误'},
                {num: 'submitted', label: '已提交'},
                {num: 'transfered', label: '已完成提现'},
                {num: 'confirming', label: '确认中'},
                {num: 'confirmed', label: '已确认上账'},
                {num: 'orphan', label: '区块被孤立'},
                {num: 'orphan-confirming', label: '孤立确认中'},
                {num: 'orphan-confirmed', label: '孤立已确认'},
                {num: 'rollback-orphan', label: '已孤立取消上帐'},
                {num: 'rollback-confirming', label: '取消后再确认中'},
                {num: 'rollback-confirmed', label: '取消后再次确认上帐'},
                {num: 'safe', label: '已确认上账'},
                {num: 'orphan-safe', label: '孤立已确认'},
                {num: 'rollback-safe', label: '取消后再次确认上帐'},
                {num: 'pre-submitted', label: '待提交'},
                {num: 'invalid', label: '错误'},
                {num: 'submitted', label: '已提交'},
                {num: 'finished', label: '已完成充值'},
                {num: 'repealed', label: '人工撤销充值'},
                {num: 'valid', label: '已完成'},
                {num: 'pre-submitted', label: '待提交'},
                {num: 'invalid', label: '非法'},
                {num: 'submitted', label: '已提交'},
                {num: 'transfered', label: '已完成'},
                {num: 'canceled', label: '已撤销'}
            ]
        }
    },
    props: {
        uid: Number
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.refresh()
        },
        refresh (page) {
            let obj = handler.clone(user.finance)
            obj.data = {
                currency: this.currency,
                type: this.type,
                uid: this.uid*1,
                direct: this.direct,
                offset: this.offset,
                size: this.size
            }
            for (let i in obj.data) {
                if (!obj.data[i]) delete obj.data[i]
            }
            this.$axios(obj).then(res => {
                this.table0Cache = res.data.items
                this.table0Date = JSON.parse(JSON.stringify(this.table0Cache))
                if (this.table0Date.length === 11) {
                    this.table0Date.pop()
                }
                if (this.direct) {
                    if (this.direct === 'next') {
                        if (this.table0Cache.length < this.size) {
                            this.nextAllow = false
                        } else {
                            this.nextAllow = true
                        }
                        this.prevAllow++
                    } else {
                        this.prevAllow--
                        this.nextAllow = true
                    }
                } else if (this.direct === null) {
                    if (this.table0Cache.length === this.size) {
                        this.nextAllow = true
                    }
                }
                this.direct = ''
                if (this.table0Cache.length === 0) {
                    this.prevAllow = 0
                    this.nextAllow = true
                }
            })
        },
        pre () {
            this.direct = 'prev'
            this.offset = this.table0Cache[0] && this.table0Cache[0].id
            this.refresh()
        },
        next () {
            this.direct = 'next'
            this.offset = this.table0Cache[this.table0Cache.length - 1] && this.table0Cache[this.table0Cache.length - 1].id
            this.refresh()
        }
    }
}

const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('userInfo.finance["币种"]')
        },
        align: 'left',
        key: 'currency'
    },
    {
        renderHeader: (h) => {
            return vm.$t('类型')
        },
        align: 'left',
        render: (h, params) => {
            for (let item of vm.typeArr) {
                if ( item.num === params.row.type) {
                    return vm.$t(item.label)
                }
            }
            return vm.$t(params.row.type)
        }
        // key: 'type'
    },
    {
        renderHeader: (h) => {
            return vm.$t('时间')
        },
        width: 150,
        align: 'left',
        key: 'prepaidTime'
    },
    {
        renderHeader: (h) => {
            return vm.$t('订单ID')
        },
        align: 'left',
        key: 'orderId'
    },
    {
        renderHeader: (h) => {
            return vm.$t('交易ID')
        },
        width: 250,
        align: 'left',
        key: 'tradeId'
    },
    {
        renderHeader: (h) => {
            return vm.$t('对方账号／地址')
        },
        width: 150,
        align: 'left',
        key: 'address'
    },
    {
        renderHeader: (h) => {
            return vm.$t('渠道')
        },
        align: 'left',
        // key: 'channel',
        render: (h, params) => {
            for (let item of vm.channelArr) {
                if ( item.num === params.row.channel) {
                    return vm.$t(item.label)
                }
            }
            return vm.$t(params.row.channel)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('数量')
        },
        align: 'left',
        key: 'amount'
    },
    {
        renderHeader: (h) => {
            return vm.$t('手续费')
        },
        align: 'left',
        key: 'withdrawFee'
    },
    {
        renderHeader: (h) => {
            return vm.$t('状态')
        },
        align: 'left',
        // key: 'status',
        render: (h, params) => {
            for (let item of vm.stausArr) {
                if ( item.num === params.row.status) {
                    return vm.$t(item.label)
                }
            }
            return vm.$t(params.row.status)
        }
    }
]
}
</script>
