<template lang="html">
    <div>
        <Row type="flex" >
            <Form :model="formItem" inline>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('UID')" v-model="formItem.uid"/>
                </FormItem>
                <FormItem>
                    <Select v-model="formItem.currencyVal" class="l-select" :placeholder="$t('选择币种')" style="width: 100px" @on-change="coinChange" v-autoLocale>
                        <Option value="">{{ $t('全部') }}</Option>
                        <Option v-for="item in currencyArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <DatePicker
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placement="bottom-end"
                        transfer
                        style="width: 322px"
                        :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                        v-model="dateRange"
                    ></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="getDepositList" v-if="$store.state.user.checkPerm('deposit:list')">{{$t('查询')}}</Button>
                </FormItem>
            </Form>
        </Row>
        <Card>
            <p slot="title">
                {{$t('基础信息')}}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="baseCols" :data="[userInfo]" style="width: 100%;"></Table>
            </Row>
            <Row type="flex" justify="center" align="middle" class="advanced-router" style="margin-top:10px;">
                <Table :columns="baseCols2" :data="[userInfo]" style="width: 100%;"></Table>
            </Row>
        </Card>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('用户充币记录列表')}}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router" v-for="(item, index) in dataList" :key="index">
                <Table :columns="baseCols3" :data="[item]" style="width: 100%;"></Table>
                <div class="table-info">
                    <span>{{ $t('交易ID：') }}: </span><span style="margin-right: 45px">{{ item['tx-hash'] }}</span>
                </div>
            </Row>
            <Row style="margin-top: 10px">
                <Col span="24">
                    <div class="flex-end-center">
                        <Button @click="toPage('prev')" :disabled="currPage === 0" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                        <Button @click="toPage('next')" :disabled="dataList.length < 10" type="primary">{{$t('下一页')}}</Button>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import { recharge } from '__util/api'
import util from '__util/util'

export default {
    data () {
        return {
            formItem: {},
            currencyVal: '',
            currencyArr: [],
            currPage: 0,
            baseCols: [
                {
                    key: 'uid',
                    renderHeader:() => {
                        return this.$t('UID')
                    }
                },
                {
                    key: 'email',
                    renderHeader:() => {
                        return this.$t('邮箱')
                    }
                },
                {
                    key: 'phone',
                    renderHeader:() => {
                        return this.$t('手机号')
                    }
                },
                {
                    key: 'authLevel',
                    renderHeader:() => {
                        return this.$t('认证级别')
                    },
                    render: (h, params) => {
                        // 当然可以拼接  ，可是万一换了呢
                        switch (params.row.authLevel) {
                            case 1:
                                return 'U1'
                                break
                            case 2:
                                return 'U2'
                                break
                            case 3:
                                return 'U3'
                                break
                            case 4:
                                return 'U4'
                                break
                            default:
                                return params.row.authLevel
                        }
                    }
                },
                {
                    key: 'amount',
                    renderHeader:() => {
                        return this.$t('净资产折合')
                    }
                }
            ],
            baseCols2: [
                {
                    key: 'fullname',
                    renderHeader:() => {
                        return this.$t('姓名')
                    }
                },
                {
                    key: 'uid',
                    renderHeader:() => {
                        return this.$t('证件信息')
                    },
                    render: (h, params) => {
                        let text = ''
                        let type = ''
                        switch (params.row.authType) {
                            case 1:
                                type = '账号认证'
                                break
                            case 2:
                                type = '手机号码认证'
                                break
                            case 3:
                                type = '银行账户认证'
                                break
                            case 4:
                                type = '居住地址认证'
                                break
                            default:
                        }
                        text += params.row.authNo || ''
                        text += type ? '(' + type + ')' : ''
                        return text
                    }
                },
                {
                    key: 'country',
                    renderHeader:() => {
                        return this.$t('国籍')
                    }
                },
                {
                    key: 'aml',
                    renderHeader:() => {
                        return this.$t('AML')
                    }
                }
            ],
            baseCols3: [
                {
                    key: 'reated-at',
                    renderHeader:() => {
                        return this.$t('申请时间')
                    },
                    render: (h, params) => {
                        return this.$moment(params.row['reated-at']).format('YYYY MM DD hh:mm:ss')
                    }
                },
                {
                    key: 'currency',
                    renderHeader:() => {
                        return this.$t('币种')
                    }
                },
                {
                    key: 'type',
                    renderHeader:() => {
                        return this.$t('渠道')
                    }
                },
                {
                    key: 'transaction-id',
                    renderHeader:() => {
                        return this.$t('订单ID')
                    }
                },
                {
                    key: 'amount',
                    renderHeader:() => {
                        return this.$t('充币数量')
                    }
                },
                {
                    key: 'fees',
                    renderHeader:() => {
                        return this.$t('手续费')
                    }
                },
                {
                    key: 'to-address',
                    renderHeader:() => {
                        return this.$t('对方地址')
                    }
                },
                {
                    key: 'state',
                    renderHeader:() => {
                        return this.$t('状态')
                    },
                    render: (h, params) => {
                        return this.financeMap[ params.row['type'] ] ?
                            this.$t(this.financeMap[ params.row['type'] ][ params.row['state'] ]) || this.$t(this.financeMap[ 'default' ][ params.row['state'] ]) :
                            this.$t(this.financeMap[ 'default' ][ params.row['state'] ])
                    }
                }
            ],
            dateRange: [],
            userInfo: {},
            dataList: [],
            financeType : {
                "deposit-virtual":"充币",
                "withdraw-virtual":"提币",
                "oldhuobi-to-bitexpro":"从主站转入",
                "bitex-to-bitexpro":"从主站转入",
                "bitexpro-to-bitex":"转出到主站",
                "bitexpro-to-oldhuobi":"转出到主站",
                "marketing-account-transfer-in":"活动奖励",
                "operations-account-loan-to-user-trade":"从系统转入",
                "operations-account-expenditure":"从系统转入",
                "operations-account-deposit-compensate-expenditure":"从系统转入",
                "operations-account-withdraw-compensate-expenditure":"从系统转入",
                "operations-account-recycling-user-trade-principal":"转出到系统",
                "operations-account-earning":"转出到系统",
                "operations-account-withdraw-compensate-earning":"转出到系统",
                "operations-account-deposit-compensate-earning":"转出到系统",
                "rebate-account-transfer-in":"推荐奖励",
                "otc-to-pro":"从OTC转入",
                "pro-to-otc":"转出到OTC",
                "fork-transfer-in":"分叉转币生成",
                "fork-transfer-out":"分叉转币消耗",
                "margin-transfer-in":"转出到杠杆账户",
                "margin-transfer-out":"从杠杆账户转入"
            },
            financeMap : {
                'default': {
                    'valid':'已完成',
                    'finished':'已完成',
                    'confirmed':'已完成',
                    'transfered':'已完成',
                    'safe':'已完成',
                    'orphan-safe':'已完成',
                    'rollback-safe':'已完成',
                    'canceled':'已撤销',
                    'repealed':'已撤销',
                    'pre-submitted':'待审核',
                    'reexamine':'待审核',
                    'submitted':'处理中',
                    'pass':'处理中',
                    'pre-transfer':'处理中',
                    'invalid':'划转失败',
                    'reject':'审核失败',
                    'confirming':'确认中',
                    'orphan-confirming':'确认中',
                    'orphan-confirmed':'确认中',
                    'rollback-confirming':'确认中',
                    'rollback-confirmed':'确认中',
                    'orphan':'待确认',
                    'rollback-orphan':'待确认',
                },
                'deposit-virtual': {
                    'confirmed': '确认中',
                    'unknown': '未知状态'
                },
                'withdraw-virtual': {
                    'invalid': '错误',
                    'submitted': '待审核',  //可以撤销
                    'reexamine': '进行复审',//可以撤销
                    'wallet-transfer': '已汇出',
                    'wallet-reject': '处理失败',
                    'confirm-error': '已汇出'
                },
                'bitexpro-to-bitex': {
                    'pre-submitted': '处理中'
                },
                'bitex-to-bitexpro': {
                    'pre-submitted': '处理中'
                }
            },
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('deposit:list') ) {
            this.getCurrencyList()
        }
    },
    methods: {
        // 还原数据
        initData () {
            this.dataList = []
            this.userInfo = {}
        },
        // 获取基础列表
        getDepositList () {
            // 验证s
            if ( !this.formItem.uid ) return
            if ( !util.uidValidate(this.formItem.uid) ) {
                this.$Message.error({content: this.$t('uid格式不正确')})
                return
            }
            recharge.depositList.data = {
                uid: parseInt(this.formItem.uid),
                currency: this.formItem.currencyVal === "" ? undefined : this.formItem.currencyVal,
                beginTime: this.formItem.beginTime || '',
                endTime: this.formItem.endTime || '',
                from: this.formItem.from || '',
                direct: this.formItem.direct
            }
            this.$axios(recharge.depositList).then((res) => {
                if ( res.data ) {
                    this.dataList = res.data.list
                    this.userInfo = res.data.userInfo
                    if ( this.dataList.length === 0 ) {
                        this.currPage = 0
                        this.formItem.direct = undefined
                        this.formItem.from = undefined
                    }
                } else {
                    this.$Message.error({content: this.$t('没有查询到结果')})
                }
            })
        },
        // 获取币种列表
        getCurrencyList () {
            this.$axios(recharge.getCurrency).then((res) => {
                res.data.map((e) => {
                    this.currencyArr.push({
                        label: e,
                        value: e
                    })
                })
            })
        },
        // 分页
        toPage (dire) {
            this.formItem.direct = dire
            if ( dire === 'prev' ) {
                this.currPage -= 1
                if ( this.dataList.length > 0 && this.currPage > 0)
                this.formItem.from = this.dataList[0].id
            }
            if ( dire === 'next' ) {
                this.currPage += 1
                this.formItem.from = this.dataList[this.dataList.length - 1].id
            }
            this.getDepositList()
        },
        // 改变币种时改变页数
        coinChange () {
            this.currPage = 0
            this.formItem.direct = undefined
            this.formItem.from = undefined
        }
    },
    watch: {
        dateRange (val) {
            this.formItem.beginTime = this.$moment(val[0]).format()
            this.formItem.endTime = this.$moment(val[1]).format()
        }
    }
}
</script>

<style lang="less" scoped>
.table-info {
    background-color: #ffffff;
    border: 1px solid #dddee1;
    border-top: none;
    padding: 15px 18px;
    width: 100%;
    padding-top: 15px;
    text-align: left;
}
</style>
