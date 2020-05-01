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
        <div v-if="$store.state.user.checkPerm('user:mgt:query:entrust:list')" class="flex-start-center" style="margin-top: 20px">
            <div class="input" style="margin-right: 10px">
                <Input v-model="basis" :placeholder="$t('计价货币')">
                    <Select v-model="currency" slot="prepend" style="width: 80px" :placeholder="$t('基础货币')" v-autoLocale>
                        <Option v-for="i in currencyList" :value="i" v-if="i !== 'krw'">{{i}}</Option>
                    </Select>
                </Input>
            </div>
            <div class="input" style="margin-right: 10px">
                <Select v-model="states" style="width: 130px" :placeholder="$t('全部')" v-autoLocale>
                    <Option value="">{{$t('全部')}}</Option>
                    <!-- <Option value="pre-submitted">{{$t('待成交')}}</Option> -->
                    <Option value="partial-filled">{{$t('部分成交')}}</Option>
                    <Option value="filled">{{$t('已成交')}}</Option>
                    <Option value="submitted">{{$t('待成交')}}</Option>
                    <Option value="canceled">{{$t('已撤销')}}</Option>
                    <Option value="partial-canceled">{{$t('部分成交（已撤单）')}}</Option>
                </Select>
            </div>
            <Button @click="refresh" type="primary" style="margin-right: 10px" v-if="$store.state.user.checkPerm('user:mgt:query:entrust:list')">{{$t('查询')}}</Button>
            <!--<Button @click="toggleModal" size="large" type="primary" style="margin-right: 30px">{{$t('选择交易对')}}</Button>!-->
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('委托记录')}}
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
import { operation, user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'entrust',
    data () {
        return {
            table0Cache: [],
            table0Date: [],
            table0Column: [],
            basis: '',
            currency: '',
            currencyList: [],
            direct: null,
            offset: null,
            size: 11,
            prevAllow: 0,
            nextAllow: false,
            states: '',
            // 状态
            statusArr: [
              {
                status: 'pre-submitted',
                name: '准备提交'
              },
              {
                status: 'submitted',
                name: '待成交'
              },
              {
                status: 'partial-filled',
                name: '部分成交'
              },
              {
                status: 'partial-canceled',
                name: '部分成交（已撤单）'
              },
              {
                status: 'filled',
                name: '完全成交'
              },
              {
                status: 'canceled',
                name: '已撤单'
              }
            ],
            typeArr: [
              {
                status: 'submit-cannel',
                name: '撤销委托'
              },
              {
                status: 'buy-market',
                name: '市价买入'
              },
              {
                status: 'sell-market',
                name: '市价卖出'
              },
              {
                status: 'buy-limit',
                name: '限价买入'
              },
              {
                status: 'sell-limit',
                name: '限价卖出'
              },
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
            this.$axios(operation.currencyList).then(res => {
                this.currencyList = res.data
            })
            this.refresh()
        },
        refresh () {
            let obj = handler.clone(user.entrust)
            obj.data = {
                symbol: this.currency + this.basis,
                uid: this.uid*1,
                direct: this.direct,
                offset: this.offset,
                size: this.size,
                states: this.states
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

export const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('订单ID')
        },
        align: 'left',
        key: 'id'
    },
    {
        renderHeader: (h) => {
            return vm.$t('userInfo.entrust["交易对"]')
        },
        align: 'left',
        key: 'symbol'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托时间')
        },
        width: 200,
        align: 'left',
        key: 'createdAt'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托类型')
        },
        align: 'left',
        key: 'type',
        render: (h, params) => {
          for (let item of vm.typeArr) {
              if ( item.status === params.row.type ) {
                  return vm.$t(item.name)
              }
          }
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托价格')
        },
        align: 'left',
        key: 'price',
        render: (h, params) => {
            if (params.row.price == '0.0') {
              return vm.$t('市价')
            } else {
              return (params.row.price*1).toFixed(8)
            }
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托数量')
        },
        align: 'left',
        // key: 'amount',
        render: (h, params) => {
            return (params.row.amount*1).toFixed(8)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('userInfo.entrust["成交总额"]')
        },
        align: 'left',
        // key: 'fieldCashAmount',
        render: (h, params) => {
            return (params.row.fieldCashAmount*1).toFixed(8)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('已处理数量')
        },
        align: 'left',
        // key: 'fieldAmount',
        render: (h, params) => {
            return (params.row.fieldAmount*1).toFixed(8)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('来源')
        },
        align: 'left',
        key: 'source'
    },
    {
        renderHeader: (h) => {
            return vm.$t('状态')
        },
        align: 'left',
        // key: 'state',
        render: (h, params) => {
          for (let item of vm.statusArr) {
              if ( item.status === params.row.state ) {
                  return vm.$t(item.name)
              }
          }
        }
    }
]
}
</script>
